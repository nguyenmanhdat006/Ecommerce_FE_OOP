import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm({ onSwitch }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md space-y-8">
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

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="user@company.com"
              className="h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#000000]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
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
              variant="link"
              className="p-0 h-auto text-sm hover:text-opacity-80 cursor-pointer"
              style={{ color: "#fea0b0" }}
              onClick={() => onSwitch("forgot")}
            >
              Forgot Your Password?
            </Button>
          </div>
        </div>

        <Button
          className="w-full h-12 text-sm font-medium text-white hover:opacity-90 rounded-lg shadow-none cursor-pointer"
          style={{ backgroundColor: "#fea0b0" }}
        >
          Log In
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">Or Login With</span>
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

        <div className="text-center text-sm text-muted-foreground">
          Don't Have An Account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-sm hover:text-opacity-80 font-medium cursor-pointer"
            style={{ color: "#fea0b0" }}
            onClick={() => onSwitch("register")}
          >
            Register Now.
          </Button>
        </div>
      </div>
    </div>
  );
}
