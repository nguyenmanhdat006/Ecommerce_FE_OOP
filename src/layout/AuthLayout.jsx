import { Warp } from "@paper-design/shaders-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Banner */}
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
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="https://www.launchuicomponents.com/favicon.svg"
              alt="Logo"
              className="w-8 h-8 mr-3"
            />
            <h1 className="text-xl font-semibold text-white">Shopease</h1>
          </div>

          {/* Main text */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-4xl text-white mb-6 leading-tight">
              Your Ultimate Shopping Companion
            </h2>
            <p className="text-white/90 text-lg leading-relaxed">
              Log in to access your Shopease dashboard and manage your shopping.
            </p>
          </div>

          <span className="text-white/70 text-sm">
            Copyright © 2025 ThangDepChai Enterprises LTD.
          </span>
        </div>
      </div>

      {/* Right side content (forms) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">{children}</div>
      </div>
    </div>
  );
}
