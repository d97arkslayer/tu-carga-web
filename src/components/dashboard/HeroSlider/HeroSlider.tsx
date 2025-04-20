import React from "react";
import { COLORS } from "../../../utils/constants";
import { requestTowService } from "../../../services/whatsappService"; // Importar el nuevo servicio

interface SlideProps {
  title: string;
  description: string;
  image: string;
}

interface HeroSliderProps {
  slide: SlideProps;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ slide }) => {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 relative">
      <section className="w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-12 sm:px-16 lg:px-20 py-12">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold mb-4">{slide.title}</h1>
            <p className="mb-6">{slide.description}</p>
            <button
              onClick={requestTowService}
              className="py-3 px-6 rounded-full font-bold transition duration-300 hover:opacity-90"
              style={{ backgroundColor: COLORS.primary, color: COLORS.black }}
            >
              Solicitar servicio
            </button>
          </div>
          <div className="relative">
            <img
              src={slide.image}
              alt="Servicio de grúa"
              className="rounded-[60px] shadow-lg max-w-[350px] w-full"
            />
          </div>
        </div>

        <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition hover:opacity-80 z-10">
          &lt;
        </button>
        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition hover:opacity-80 z-10">
          &gt;
        </button>
      </section>
    </div>
  );
};

export default HeroSlider;
