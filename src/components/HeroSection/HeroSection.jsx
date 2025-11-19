import HeroImg from "../../assets/img/hero-img.png";

const HeroSection = () => {
  return (
    <div
      className="relative flex items-center bg-cover bg-center text-left min-h-[500px] h-[70vh] sm:h-[80vh] lg:h-svh w-full"
      style={{ backgroundImage: `url(${HeroImg})` }}
    >
      <div className="bg-transparent absolute top-0 right-0 bottom-0 left-0 bg-black/20"></div>
      <main className="px-6 sm:px-10 md:px-16 lg:px-24 z-10 max-w-7xl">
        <div className="text-left">
          <h2 className="text-lg sm:text-xl md:text-2xl text-white font-medium">
            T-shirt / Tops
          </h2>
        </div>
        <p className="mt-2 sm:mt-3 md:mt-4 text-white sm:max-w-xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Summer Value Pack
        </p>
        <p className="mt-2 sm:mt-3 md:mt-4 text-white sm:max-w-xl text-base sm:text-lg md:text-xl lg:text-2xl">
          cool / colorful / comfy
        </p>
        <button className="border rounded mt-4 sm:mt-6 border-black hover:bg-white hover:text-black hover:border-black text-white bg-black px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105">
          Shop Now
        </button>
      </main>
    </div>
  );
};

export default HeroSection;
