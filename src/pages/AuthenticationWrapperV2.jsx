import React, { useEffect, useState, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Splash from '../components/Splash';
import AuthLayout from '../layout/AuthLayout';

const AuthenticationWrapperV2 = () => {
  const isLoading = useSelector((state) => state?.authSlice?.loading);
  const isAuthenticated = useSelector((state) => state?.authSlice?.isAuthenticated);
  const [showSplash, setShowSplash] = useState(false);
  const hasShownSplash = useRef(false);
  const navigate = useNavigate();

  // Show splash screen for 2 seconds after successful authentication
  useEffect(() => {
    if (isAuthenticated && !hasShownSplash.current) {
      hasShownSplash.current = true;
      setShowSplash(true);
      
      const timer = setTimeout(() => {
        setShowSplash(false);
        navigate('/');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout>
      <Outlet />
      {showSplash && <Splash />}
      {isLoading && !showSplash && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-[9999] bg-white/80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fea0b0]"></div>
        </div>
      )}
    </AuthLayout>
  );
};

export default AuthenticationWrapperV2;

