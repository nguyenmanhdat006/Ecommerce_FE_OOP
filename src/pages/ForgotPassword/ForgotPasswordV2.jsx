import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import AuthFormLayout from "@/components/common/AuthFormLayout";

export default function ForgotPasswordV2() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        // TODO: Implement forgot password API call
        // await authAPI.forgotPassword({ email });
        
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        toast.success("Password reset link sent to your email!");
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/v2/login");
        }, 2000);
      } catch (err) {
        toast.error("Failed to send reset link. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [email, navigate]
  );

  return (
    <div className="relative">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/v2/login")}
        className="absolute -left-4 -top-12 lg:-left-12 lg:-top-4 p-2 hover:bg-gray-100 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <AuthFormLayout
        title="Reset Password"
        subtitle="Enter your email address and we'll send you a reset link."
      >
        {/* Form fields */}
        <form onSubmit={onSubmit} className="space-y-4">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              className="h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#000000]"
            />
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-sm font-medium text-white hover:opacity-90 rounded-lg shadow-none cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: "#fea0b0" }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        {/* Back to login */}
        <div className="text-center text-sm text-muted-foreground">
          Remember Your Password?{" "}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-sm hover:text-opacity-80 font-medium cursor-pointer"
            style={{ color: "#ff80d4" }}
            onClick={() => navigate("/v2/login")}
          >
            Back to Login.
          </Button>
        </div>
      </AuthFormLayout>
    </div>
  );
}

