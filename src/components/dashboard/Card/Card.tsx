// src/components/dashboard/Card/Card.tsx
import React from "react";
import { COLORS } from "../../../utils/constants";

interface CardProps {
  icon: React.ReactNode;
  title: string;
  status: "Vigente" | "Prox. vencer" | "Vencido";
}

const statusColors = {
  Vigente: COLORS.green,
  "Prox. vencer": COLORS.orange,
  Vencido: COLORS.red,
};

const Card: React.FC<CardProps> = ({ icon, title, status }) => {
  return (
    <div className="bg-white rounded-[20px] shadow-md p-4 flex flex-col items-center justify-between cursor-pointer transition-transform duration-300 hover:scale-105 h-48 max-w-[200px] mx-auto w-full">
      <div className="mt-4 mb-2">
        <div
          className="flex items-center justify-center rounded-full p-3"
          style={{ backgroundColor: COLORS.grayLight }}
        >
          {icon}
        </div>
      </div>
      <div className="flex flex-col items-center flex-grow justify-center">
        <h3 className="font-semibold text-sm text-center">{title}</h3>
      </div>
      <span
        className="font-bold mt-auto mb-4 px-3 py-1 rounded-full text-black text-xs"
        style={{ backgroundColor: statusColors[status] }}
      >
        {status}
      </span>
    </div>
  );
};

export default Card;
