import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

export default function SocialLoginSection({
  title = "Or Login With",
  onGoogleLogin,
  onFacebookLogin,
  showApple = false,
  onAppleLogin,
}) {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">
            {title}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {onGoogleLogin && (
          <Button
            type="button"
            variant="outline"
            onClick={onGoogleLogin}
            className="h-12 border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-lg bg-white shadow-none cursor-pointer flex items-center justify-center gap-2"
          >
            <FcGoogle className="h-5 w-5" />
            Google
          </Button>
        )}
        {onFacebookLogin && (
          <Button
            type="button"
            variant="outline"
            onClick={onFacebookLogin}
            className="h-12 border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-lg bg-white shadow-none cursor-pointer flex items-center justify-center gap-2"
          >
            <FaFacebookF className="h-5 w-5 text-blue-600" />
            Facebook
          </Button>
        )}
        {showApple && onAppleLogin && (
          <Button
            type="button"
            variant="outline"
            onClick={onAppleLogin}
            className="h-12 border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-lg bg-white shadow-none cursor-pointer"
          >
            Apple
          </Button>
        )}
      </div>
    </>
  );
}

