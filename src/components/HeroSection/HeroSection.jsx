import HeroImg from "../../assets/img/hero-img.png";

const HeroSection = () => {
  return (
    <div
      className="
        relative 
        flex 
        bg-cover 
        bg-right 
        sm:bg-center  
        min-h-[500px] 
        h-[70vh] 
        sm:h-[80vh] 
        lg:h-svh 
        w-full
      "
      style={{ backgroundImage: `url(${HeroImg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* TEXT + BUTTON WRAPPER */}
      <main
        className="
          relative z-10 
          px-6 sm:px-10 md:px-16 lg:px-24 
          flex flex-col 
          
          justify-end items-center text-center   /* >>> mobile center bottom */
          
          sm:justify-center sm:items-start sm:text-left  /* >>> desktop left */
          
          w-full
          pb-10 sm:pb-0
        "
      >
        <h2 className="text-lg sm:text-xl md:text-2xl text-white font-medium">
          T-shirt / Tops
        </h2>

        <p className="mt-2 sm:mt-3 md:mt-4 text-white sm:max-w-xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Summer Value Pack
        </p>

        <p className="mt-2 sm:mt-3 md:mt-4 text-white sm:max-w-xl text-base sm:text-lg md:text-xl lg:text-2xl">
          Cool / Colorful / Comfy
        </p>

        <button className="border rounded mt-4 sm:mt-6 border-black hover:bg-white hover:text-black hover:border-black text-white bg-black px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105">
          Shop Now
        </button>
      </main>
    </div>
  );
};

export default HeroSection;
