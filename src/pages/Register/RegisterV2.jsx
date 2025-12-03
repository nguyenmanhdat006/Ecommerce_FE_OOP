import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { register, clearAuthError } from "@/store/authSlice";
import { toast } from "react-hot-toast";
import AuthFormLayout from "@/components/common/AuthFormLayout";

export default function RegisterV2() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
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
            userName: values.email,
            password: values.password,
            fullName: values.fullName,
          })
        ).unwrap();
        
        toast.success("Registration successful! Please login.");
        
        // Delay 2s trước khi chuyển sang trang login
        setTimeout(() => {
          navigate("/v2/login");
        }, 2000);
      } catch (err) {
        const errorMessage =
          err?.message || err?.error || "Registration failed!";
        toast.error(errorMessage);
      }
    },
    [dispatch, values, navigate]
  );

  return (
    <AuthFormLayout
      title="Create Account"
      subtitle="Create a new account to get started with Shopease."
    >
      {/* Form fields */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="fullName"
            className="text-sm font-medium text-foreground"
          >
            Full Name
          </Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="John Doe"
            value={values.fullName}
            onChange={handleOnChange}
            disabled={loading}
            required
            className="h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#000000]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="user@company.com"
            value={values.email}
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
              autoComplete="new-password"
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

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-foreground"
          >
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={values.confirmPassword}
              onChange={handleOnChange}
              disabled={loading}
              required
              autoComplete="new-password"
              className="h-12 pr-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#000000]"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {typeof error === "string"
              ? error
              : error?.message || "Registration failed!"}
          </p>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-sm font-medium text-white hover:opacity-90 rounded-lg shadow-none cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: "#fea0b0" }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      {/* Social login */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">
            Or Sign Up With
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-12 border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-lg bg-white shadow-none cursor-pointer"
        >
          Google
        </Button>
        <Button
          variant="outline"
          className="h-12 border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-lg bg-white shadow-none cursor-pointer"
        >
          Apple
        </Button>
      </div>

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

