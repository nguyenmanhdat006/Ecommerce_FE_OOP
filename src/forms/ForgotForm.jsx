import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
  
export default function ForgotForm() {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-md space-y-8">

      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <Button
            variant="button"
            onClick={() => navigate(-1) || navigate("/")}
            className="absolute left-8 top-8 p-2 hover:bg-gray-100 cursor-pointer lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl text-foreground">Reset Password</h2>
          <p className="text-muted-foreground">
            Enter your email address and we'll send you a reset link.
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
        </div>

        <Button
          className="w-full h-12 text-sm font-medium text-white hover:opacity-90 rounded-lg shadow-none cursor-pointer"
          style={{ backgroundColor: "#fea0b0" }}
        >
          Send Reset Link
        </Button>
      </div>
    </div>
  );
}
