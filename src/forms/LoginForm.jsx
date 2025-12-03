import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearAuthError } from "@/store/authSlice";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "@/api/constant";
import { FcGoogle } from "react-icons/fc"; // Google color icon
import { FaFacebookF } from "react-icons/fa"; // Facebook icon

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleLogin = useCallback(() => {
    window.location.href = API_BASE_URL + "/oauth2/authorization/google";
  }, []);

  const [values, setValues] = useState({
    userName: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.authSlice
  );

  // Navigate after successful login
  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login successful!");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Clear error on input change
  useEffect(() => {
    if (error && (values.email || values.password)) {
      dispatch(clearAuthError());
    }
  }, [values.email, values.password, error, dispatch]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      dispatch(clearAuthError());

      try {
        await dispatch(login(values)).unwrap();
      } catch (err) {
        const msg = err?.message || err?.error || "Invalid Credentials!";
        toast.error(msg);
      }
    },
    [dispatch, values]
  );

  return (
    <div className="w-full max-w-md space-y-8">
      <Button
        variant="button"
        onClick={() => navigate(-1) || navigate("/")}
        className="absolute left-8 top-8 p-2 hover:bg-gray-100 cursor-pointer lg:hidden"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <div className="lg:hidden text-center mb-8">
        <img
          src="https://www.launchuicomponents.com/favicon.svg"
          alt="Logo"
          className="w-8 h-8 mx-auto mb-3"
        />
        <h1 className="text-xl font-semibold text-foreground">Shopease</h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl text-foreground">Welcome Back</h2>
          <p className="text-muted-foreground">
            Enter your email and password to access your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Email
            </Label>
            <Input
              id="userName"
              name="userName"
              type="email"
              value={values.userName}
              onChange={handleChange}
              placeholder="user@company.com"
              className="h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#000000]"
              disabled={loading}
              required
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
                value={values.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="h-12 pr-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#000000]"
                disabled={loading}
                required
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
              variant="button"
              type="button"
              className="p-0 h-auto text-sm hover:text-opacity-80 cursor-pointer"
              style={{ color: "#fea0b0" }}
              onClick={() => navigate("/v1/forgot")}
            >
              Forgot Your Password?
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-sm font-medium text-white hover:opacity-90 rounded-lg shadow-none cursor-pointer"
            style={{ backgroundColor: "#fea0b0" }}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Log In"}
          </Button>
        </form>

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
            variant="outline"
            className="h-12 border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-lg bg-white shadow-none cursor-pointer"
            onClick={() => handleGoogleLogin()}
          >
            <FcGoogle className="mr-2" /> Google
          </Button>
          <Button
            variant="outline"
            className="h-12 border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-lg bg-white shadow-none cursor-pointer"
          >
            <FaFacebookF className="mr-2 text-blue-500" /> Facebook
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Don't Have An Account?{" "}
          <Button
            variant="button"
            type="button"
            className="p-0 h-auto text-sm hover:text-opacity-80 font-medium cursor-pointer"
            style={{ color: "#fea0b0" }}
            onClick={() => navigate("/v1/register")}
          >
            Register Now.
          </Button>
        </div>
      </div>
    </div>
  );
}
