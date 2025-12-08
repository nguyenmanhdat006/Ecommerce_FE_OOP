import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { login, clearAuthError } from "@/store/authSlice";
import { fetchUserCarts } from '@/store/features/cart';
import { toast } from "react-hot-toast";
import AuthFormLayout from "@/components/common/AuthFormLayout";
import { API_BASE_URL } from "@/api/constant";
import LoginV2Form from "@/forms/LoginV2Form";
import SocialLoginSection from "@/components/common/SocialLoginSection";

export default function LoginV2() {
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    userName: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.authSlice
  );

  // Handle successful login - AuthenticationWrapperV2 will handle navigation with splash
  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login successful!");
    }
  }, [isAuthenticated]);

  // Clear error when user starts typing
  useEffect(() => {
    if (error && (values.userName || values.password)) {
      dispatch(clearAuthError());
    }
  }, [values.userName, values.password, error, dispatch]);

  const handleOnChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      dispatch(clearAuthError());

      try {
  await dispatch(login(values)).unwrap();
  // Fetch user's carts immediately after successful login so the UI (badge) updates
  dispatch(fetchUserCarts());
      } catch (err) {
        const errorMessage =
          err?.message || err?.error || "Invalid Credentials!";
        toast.error(errorMessage);
      }
    },
    [dispatch, values]
  );

  const handleGoogleLogin = useCallback(() => {
    window.location.href = API_BASE_URL + "/oauth2/authorization/google";
  }, []);

  const handleFacebookLogin = useCallback(() => {
    // TODO: Implement Facebook login
    toast.info("Facebook login coming soon!");
  }, []);

  return (
    <AuthFormLayout
      title="Welcome Back"
      subtitle="Enter your email and password to access your account."
    >
      {/* Form fields */}
      <LoginV2Form
        values={values}
        handleOnChange={handleOnChange}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        loading={loading}
        error={error}
        onSubmit={onSubmit}
        navigate={navigate}
      />

      {/* Social login */}
      <SocialLoginSection
        title="Or Login With"
        onGoogleLogin={handleGoogleLogin}
        onFacebookLogin={handleFacebookLogin}
      />

      {/* Switch to register */}
      <div className="text-center text-sm text-muted-foreground">
        Don't Have An Account?{" "}
        <Button
          type="button"
          variant="link"
          className="p-0 h-auto text-sm hover:text-opacity-80 font-medium cursor-pointer"
          style={{ color: "#fea0b0" }}
          onClick={() => navigate("/v2/register")}
        >
          Register Now.
        </Button>
      </div>
    </AuthFormLayout>
  );
}
