// src/components/dashboard/Dashboard/Dashboard.tsx
import React, { useState } from "react";
import Card from "../Card";
import InsuranceIcon from "../../../assets/icons/insurance.png";
import SoatIcon from "../../../assets/icons/soat.png";
import MaintainanceIcon from "../../../assets/icons/maintain.png";
import LicenceIcon from "../../../assets/icons/licence.png";
import RoadKit from "../../../assets/icons/road_kit.png";
import Tecno from "../../../assets/icons/tecno.png";
import SOATDetailModal from "../SOATDetailModal";
import { useUserContext } from "../../../context/UserContext";

const Dashboard: React.FC = () => {
  const [showSOATModal, setShowSOATModal] = useState(false);
  const { user } = useUserContext();
  return (
    <section className="bg-white rounded-[25px] shadow-lg p-8 mx-8 my-12">
      <h2 className="text-2xl font-bold mb-2">Hola, {`${user?.name}`}</h2>
      <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold mb-4">
        {user?.vehicles?.[0]?.plate}
      </span>
      <p className="mb-6">
        Selecciona una de las categorías para gestionar un recordatorio
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        <div onClick={() => setShowSOATModal(true)} className="cursor-pointer">
          <Card
            // @ts-ignore
            icon={<img src={SoatIcon} alt="Soat Icon" width={30} height={30} />}
            title="Seguro SOAT"
            status="Vigente"
          />
        </div>
        <Card
          // @ts-ignore
          icon={<img src={Tecno} alt="tecno Icon" width={30} height={30} />}
          title="Tecnico mecánica"
          status="Prox. vencer"
        />
        <Card
          // @ts-ignore
          icon={
            <img src={LicenceIcon} alt="license Icon" width={30} height={30} />
          }
          title="Licencia de conducción"
          status="Vencido"
        />
        <Card
          // @ts-ignore
          icon={<img src={RoadKit} alt="Roadkit Icon" width={30} height={30} />}
          title="Kit de carretera"
          status="Prox. vencer"
        />
        <Card
          // @ts-ignore
          icon={
            <img
              src={InsuranceIcon}
              alt="Insurance Icon"
              width={30}
              height={30}
            />
          }
          title="Polizas de seguro"
          status="Vencido"
        />
        <Card
          // @ts-ignore
          icon={
            <img
              src={MaintainanceIcon}
              alt="Maintainance Icon"
              width={30}
              height={30}
            />
          }
          title="Mantenimiento"
          status="Vigente"
        />
      </div>
      {showSOATModal && (
        <SOATDetailModal
          onClose={() => setShowSOATModal(false)}
          status="Vigente"
          expirationDate="24 Abril 2025"
          issueDate="24 Abril 2024"
          policyNumber="12345678"
          licensePlate="JNN813"
        />
      )}
    </section>
  );
};

export default Dashboard;
