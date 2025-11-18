import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Warp } from "@paper-design/shaders-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentView, setCurrentView] = useState("login"); // login | register | forgot

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left side background/info */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ backgroundColor: "#000000" }}
      >
        <Warp
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
          proportion={0.45}
          softness={1}
          distortion={0.25}
          swirl={0.8}
          swirlIterations={10}
          shape="checks"
          shapeScale={0.1}
          scale={1}
          rotation={0}
          speed={1}
          colors={[
            "hsl(340, 100%, 20%)",
            "hsl(320, 100%, 75%)",
            "hsl(350, 90%, 30%)",
            "hsl(330, 100%, 80%)",
          ]}
        />
        <div className="relative z-10 flex flex-col justify-between w-full px-12 py-12">
          <div className="flex items-center">
            <img
              src="https://www.launchuicomponents.com/favicon.svg"
              alt="Logo"
              className="w-8 h-8 mr-3"
            />

            <h1 className="text-xl font-semibold text-white">Shopease</h1>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-4xl text-white mb-6 leading-tight">
              Your Ultimate Shopping Companion
            </h2>
            <p className="text-white/90 text-lg leading-relaxed">
              Log in to access your Shopease dashboard and manage your shopping.
            </p>
          </div>

          <div className="flex justify-between items-center text-white/70 text-sm">
            <span>Copyright © 2025 ThangDepChai Enterprises LTD.</span>
          </div>
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
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
            {/* Header */}
            <div className="space-y-2 text-center">
              {currentView === "forgot" && (
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView("login")}
                  className="absolute left-8 top-8 p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h2 className="text-3xl text-foreground">
                {currentView === "login" && "Welcome Back"}
                {currentView === "register" && "Create Account"}
                {currentView === "forgot" && "Reset Password"}
              </h2>
              <p className="text-muted-foreground">
                {currentView === "login" &&
                  "Enter your email and password to access your account."}
                {currentView === "register" &&
                  "Create a new account to get started with Shopease."}
                {currentView === "forgot" &&
                  "Enter your email address and we'll send you a reset link."}
              </p>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              {currentView === "register" && (
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-foreground"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#000000]"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@company.com"
                  className="h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#000000]"
                />
              </div>

              {currentView !== "forgot" && (
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
              )}

              {currentView === "register" && (
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
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      className="h-12 pr-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#000000]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {currentView === "login" && (
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
                    onClick={() => setCurrentView("forgot")}
                  >
                    Forgot Your Password?
                  </Button>
                </div>
              )}
            </div>

            {/* Submit button */}
            <Button
              className="w-full h-12 text-sm font-medium text-white hover:opacity-90 rounded-lg shadow-none cursor-pointer"
              style={{ backgroundColor: "#fea0b0" }}
            >
              {currentView === "login" && "Log In"}
              {currentView === "register" && "Create Account"}
              {currentView === "forgot" && "Send Reset Link"}
            </Button>

            {/* Social login */}
            {currentView !== "forgot" && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">
                      Or {currentView === "login" ? "Login" : "Sign Up"} With
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
              </>
            )}

            {/* Switch login/register */}
            <div className="text-center text-sm text-muted-foreground">
              {currentView === "login" && (
                <>
                  Don't Have An Account?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm hover:text-opacity-80 font-medium cursor-pointer"
                    style={{ color: "#fea0b0" }}
                    onClick={() => setCurrentView("register")}
                  >
                    Register Now.
                  </Button>
                </>
              )}
              {currentView === "register" && (
                <>
                  Already Have An Account?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm hover:text-opacity-80 font-medium cursor-pointer"
                    style={{ color: "#ff80d4" }}
                    onClick={() => setCurrentView("login")}
                  >
                    Sign In.
                  </Button>
                </>
              )}
              {currentView === "forgot" && (
                <>
                  Remember Your Password?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm hover:text-opacity-80 font-medium cursor-pointer"
                    style={{ color: "#ff80d4" }}
                    onClick={() => setCurrentView("login")}
                  >
                    Back to Login.
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
