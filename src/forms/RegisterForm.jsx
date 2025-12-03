import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/features/common";
import { registerAPI } from "@/api/authentication";
import VerifyCode from "@/pages/Register/VerifyCode";
import { toast } from "react-hot-toast";

export default function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [enableVerify, setEnableVerify] = useState(false);

  const handleOnChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setError("");
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      if (values.password !== values.confirmPassword) {
        setError("Passwords do not match!");
        return;
      }

      dispatch(setLoading(true));
      try {
        const res = await registerAPI(values);
        if (res?.code === 200) {
          toast.success("Register successful! Please verify your email.");
          setEnableVerify(true);
        } else {
          setError(res?.message || "Registration failed!");
        }
      } catch (err) {
        setError("Invalid or email already exists!");
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, values]
  );

  if (enableVerify) {
    return <VerifyCode email={values.email} />;
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <Button
            variant="link"
            onClick={() => navigate(-1) || navigate("/")}
            className="absolute left-8 top-8 p-2 hover:bg-gray-100 cursor-pointer lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl text-foreground">Create Account</h2>
          <p className="text-muted-foreground">
            Create a new account to get started with Shopease.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
              First Name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              value={values.firstName}
              onChange={handleOnChange}
              placeholder="First Name"
              className="h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#000000]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
              Last Name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              value={values.lastName}
              onChange={handleOnChange}
              placeholder="Last Name"
              className="h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#000000]"
              required
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
              value={values.email}
              onChange={handleOnChange}
              placeholder="user@company.com"
              className="h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#000000]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium text-foreground">
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={values.phoneNumber}
              onChange={handleOnChange}
              placeholder="Phone Number"
              className="h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#000000]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleOnChange}
                placeholder="Enter password"
                className="h-12 pr-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#000000]"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={values.confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm password"
                className="h-12 pr-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#000000]"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
              </Button>
            </div>
          </div>

          {error && <p className="text-red-700 text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full h-12 text-sm font-medium text-white hover:opacity-90 rounded-lg shadow-none cursor-pointer"
            style={{ backgroundColor: "#fea0b0" }}
          >
            Create Account
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Already Have An Account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-sm hover:text-opacity-80 font-medium cursor-pointer"
            style={{ color: "#ff80d4" }}
            onClick={() => navigate("/v2/login")}
          >
            Sign In.
          </Button>
        </div>
      </div>
    </div>
  );
}
