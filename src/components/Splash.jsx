import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Splash({ onFinish }) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-white flex items-center justify-center z-[9999]">
      <DotLottieReact
        src="/animations/shopping_girl.json"
        autoplay
        loop={false}
        dotLottieRefCallback={(player) => {
          if (!player) return; // <-- thêm check null
          player.addEventListener("complete", () => {
            onFinish?.();
          });
        }}
      />
    </div>
  );
}
