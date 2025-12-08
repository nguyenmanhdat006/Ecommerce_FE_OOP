import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { register, clearAuthError } from "@/store/authSlice";
import { toast } from "react-hot-toast";
import AuthFormLayout from "@/components/common/AuthFormLayout";
import VerifyCodeV2 from "./VerifyCodeV2";
import RegisterV2Form from "../../forms/RegisterV2Form";
import SocialLoginSection from "@/components/common/SocialLoginSection";
import { API_BASE_URL } from "@/api/constant";

export default function RegisterV2() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [enableVerify, setEnableVerify] = useState(false);
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.authSlice);

  // Clear error when user starts typing
  useEffect(() => {
    if (error && Object.values(values).some((val) => val)) {
      dispatch(clearAuthError());
    }
  }, [values, error, dispatch]);

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

      // Validate passwords match
      if (values.password !== values.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }

      try {
        await dispatch(
          register({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
            phoneNumber: values.phoneNumber,
          })
        ).unwrap();
        
        toast.success("Registration successful! Please verify your email.");
        setEnableVerify(true);
      } catch (err) {
        const errorMessage =
          err?.message || err?.error || "Registration failed!";
        toast.error(errorMessage);
      }
    },
    [dispatch, values]
  );

  const handleGoogleLogin = useCallback(() => {
    window.location.href = API_BASE_URL + "/oauth2/authorization/google";
  }, []);

  const handleFacebookLogin = useCallback(() => {
    // TODO: Implement Apple login
    toast.info("Apple login coming soon!");
  }, []);

  if (enableVerify) {
    return <VerifyCodeV2 email={values.email} />;
  }

  return (
    <AuthFormLayout
      title="Create Account"
      subtitle="Create a new account to get started with Shopease."
    >
      {/* Form fields */}
      <RegisterV2Form
        values={values}
        handleOnChange={handleOnChange}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        loading={loading}
        error={error}
        onSubmit={onSubmit}
      />

      {/* Social login */}
      <SocialLoginSection
        title="Or Sign Up With"
        onGoogleLogin={handleGoogleLogin}
        showApple={true}
        onFacebookLogin={handleFacebookLogin}
      />

      {/* Switch to login */}
      <div className="text-center text-sm text-muted-foreground">
        Already Have An Account?{" "}
        <Button
          type="button"
          variant="link"
          className="p-0 h-auto text-sm hover:text-opacity-80 font-medium cursor-pointer"
          style={{ color: "#ff80d4" }}
          onClick={() => navigate("/v2/login")}
        >
          Sign In.
        </Button>
      </div>
    </AuthFormLayout>
  );
}

