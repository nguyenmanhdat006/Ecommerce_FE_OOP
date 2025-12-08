import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function LoginV2Form({
  values,
  handleOnChange,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  loading,
  error,
  onSubmit,
  navigate,
}) {
  return (
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
  );
}

