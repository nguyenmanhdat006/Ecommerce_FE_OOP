import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function RegisterForm({ onSwitch }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <Button
            variant="ghost"
            onClick={() => onSwitch("login")}
            className="absolute left-8 top-8 p-2 hover:bg-gray-100 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl text-foreground">Create Account</h2>
          <p className="text-muted-foreground">
            Create a new account to get started with Shopease.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className="h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#000000]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@company.com"
              className="h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#000000]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
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
        </div>

        <Button
          className="w-full h-12 text-sm font-medium text-white hover:opacity-90 rounded-lg shadow-none cursor-pointer"
          style={{ backgroundColor: "#fea0b0" }}
        >
          Create Account
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Already Have An Account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-sm hover:text-opacity-80 font-medium cursor-pointer"
            style={{ color: "#ff80d4" }}
            onClick={() => onSwitch("login")}
          >
            Sign In.
          </Button>
        </div>
      </div>
    </div>
  );
}
