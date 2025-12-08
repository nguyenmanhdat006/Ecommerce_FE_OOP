import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VerifyCodeV2Form({
  code,
  handleOnChange,
  loading,
  error,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label
          htmlFor="code"
          className="text-sm font-medium text-foreground"
        >
          Verification Code
        </Label>
        <Input
          id="code"
          name="code"
          type="text"
          placeholder="000000"
          value={code}
          onChange={handleOnChange}
          disabled={loading}
          required
          maxLength={6}
          className="h-12 text-center text-2xl tracking-widest border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#000000]"
          style={{ letterSpacing: "0.5em" }}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}

      <Button
        type="submit"
        disabled={loading || code.length !== 6}
        className="w-full h-12 text-sm font-medium text-white hover:opacity-90 rounded-lg shadow-none cursor-pointer disabled:opacity-50"
        style={{ backgroundColor: "#fea0b0" }}
      >
        {loading ? "Verifying..." : "Verify Email"}
      </Button>
    </form>
  );
}

