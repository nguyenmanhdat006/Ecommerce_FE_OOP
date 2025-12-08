import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { authAPI } from "@/api/auth.api";
import { toast } from "react-hot-toast";
import AuthFormLayout from "@/components/common/AuthFormLayout";
import VerifyCodeV2Form from "../../forms/VerifyCodeV2Form";

export default function VerifyCodeV2({ email }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // Only allow digits, max 6
    setCode(value);
    setError("");
  }, []);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      if (code.length !== 6) {
        setError("Please enter a 6-digit verification code");
        return;
      }

      setLoading(true);
      try {
        await authAPI.verify({
          userName: email,
          code: code,
        });
        
        setIsVerified(true);
        toast.success("Email verified successfully!");
        
        // Delay 2s trước khi chuyển sang trang login
        setTimeout(() => {
          navigate("/v2/login");
        }, 2000);
      } catch (err) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "The verification code you entered is incorrect or has expired.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [code, email, navigate]
  );

  if (isVerified) {
    return (
      <AuthFormLayout
        title="Email Verified"
        subtitle="Your email has been successfully verified."
      >
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Thank you! Your email has been successfully verified. You can now log
            in to your account.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting to login page...
          </p>
        </div>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout
      title="Verify Your Email"
      subtitle="Please enter the verification code sent to your email."
    >
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Registration successful! Please check your email for the verification
            code to complete your registration.
          </p>
          <p className="text-sm font-medium text-foreground">
            Enter the 6-digit verification code sent to{" "}
            <span className="text-[#fea0b0]">{email}</span>
          </p>
        </div>

        <VerifyCodeV2Form
          code={code}
          handleOnChange={handleOnChange}
          loading={loading}
          error={error}
          onSubmit={onSubmit}
        />

        <div className="text-center text-sm text-muted-foreground">
          Didn't receive the code?{" "}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-sm hover:text-opacity-80 font-medium cursor-pointer"
            style={{ color: "#ff80d4" }}
            onClick={() => {
              // TODO: Implement resend code functionality
              toast.info("Resend code functionality coming soon");
            }}
          >
            Resend Code
          </Button>
        </div>
      </div>
    </AuthFormLayout>
  );
}

