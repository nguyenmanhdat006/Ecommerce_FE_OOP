import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { login, clearAuthError } from "@/store/authSlice";
import { toast } from "react-hot-toast";
import AuthFormLayout from "@/components/common/AuthFormLayout";
import { FcGoogle } from "react-icons/fc"; // Google color icon
import { FaFacebookF } from "react-icons/fa"; // Facebook icon
import { API_BASE_URL } from "@/api/constant";

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
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </Label>
          <Input
            id="email"
            name="userName"
            type="email"
            placeholder="user@company.com"
            value={values.userName}
            onChange={handleOnChange}
            disabled={loading}
            required
            className="h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#000000]"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={values.password}
              onChange={handleOnChange}
              disabled={loading}
              required
              autoComplete="current-password"
              className="h-12 pr-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#000000]"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-gray-300 cursor-pointer"
            />
            <Label
              htmlFor="remember"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Remember Me
            </Label>
          </div>
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-sm hover:text-opacity-80 cursor-pointer"
            style={{ color: "#fea0b0" }}
            onClick={() => navigate("/v2/forgot-password")}
          >
            Forgot Your Password?
          </Button>
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {typeof error === "string"
              ? error
              : error?.message || "Invalid Credentials!"}
          </p>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-sm font-medium text-white hover:opacity-90 rounded-lg shadow-none cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: "#fea0b0" }}
        >
          {loading ? "Signing In..." : "Log In"}
        </Button>
      </form>

      {/* Social login */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">
            Or Login With
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          className="h-12 border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-lg bg-white shadow-none cursor-pointer flex items-center justify-center gap-2"
        >
          <FcGoogle className="h-5 w-5" />
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleFacebookLogin}
          className="h-12 border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-lg bg-white shadow-none cursor-pointer flex items-center justify-center gap-2"
        >
          <FaFacebookF className="h-5 w-5 text-blue-600" />
          Facebook
        </Button>
      </div>

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
