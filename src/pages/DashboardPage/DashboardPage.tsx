import React from "react";
import Header from "../../components/dashboard/Header/Header";
import HeroSlider from "../../components/dashboard/HeroSlider";
import Dashboard from "../../components/dashboard/Dashboard/Dashboard";
import { COLORS } from "../../utils/constants";
import gruaImage from "../../assets/images/grua_home.png";
import { useUserContext } from "../../context/UserContext";

const DashboardPage: React.FC = () => {
  const { user, isLoading, error } = useUserContext();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="loader">Cargando...</div>
      </div>
    );
  }
  const slides = [
    {
      title: "Solicita tu grua\n" + "o transporte de\n" + "carga 24/7",
      description:
        "En tu carga estamos listos para asistirte\n" +
        "en cualquier momento. ",
      image: gruaImage,
    },
  ];

  return (
    <div
      className="h-screen overflow-y-auto"
      style={{
        scrollbarWidth: "none" /* Firefox */,
        msOverflowStyle: "none" /* IE and Edge */,
      }}
    >
      {/* Split background - top half gray */}
      <div
        className="absolute top-0 left-0 w-full h-3/4 z-0"
        style={{ backgroundColor: COLORS.grayLight }}
      />

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSlider slide={slides[0]} />
          <Dashboard />
        </div>
      </div>

      {/* Style to hide scrollbar in WebKit browsers */}
      <style>
        {`
          div.h-screen.overflow-y-auto::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

export default DashboardPage;
