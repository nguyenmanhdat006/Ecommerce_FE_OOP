import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getUser, isTokenValid } from "@/utils/jwt-helper";
import { toast } from "react-hot-toast";

export function AdminRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      // Kiểm tra token hợp lệ
      if (!isTokenValid()) {
        setIsAuthorized(false);
        setIsChecking(false);
        toast.error("Vui lòng đăng nhập để truy cập trang này.");
        return;
      }

      // Lấy user từ localStorage
      const user = getUser();
      
      // Kiểm tra user có tồn tại và có role ADMIN không
      if (!user) {
        setIsAuthorized(false);
        setIsChecking(false);
        toast.error("Vui lòng đăng nhập để truy cập trang này.");
        return;
      }

      // Kiểm tra role (có thể là "ADMIN" hoặc "ROLE_ADMIN" tùy backend)
      const userRole = user.role || user.rawRole || "";
      const isAdmin = 
        userRole === "ADMIN" || 
        userRole === "ROLE_ADMIN" ||
        userRole?.toUpperCase() === "ADMIN";

      if (!isAdmin) {
        toast.error("Bạn không có quyền truy cập trang này. Chỉ admin mới được phép.");
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [location.pathname]);

  // Hiển thị loading khi đang kiểm tra
  if (isChecking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Nếu không được phép, redirect về trang chủ
  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  // Nếu được phép, render children
  return <>{children}</>;
}

