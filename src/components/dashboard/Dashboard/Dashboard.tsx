import React, { useState } from "react";
import Card from "../Card";
import InsuranceIcon from "../../../assets/icons/insurance.png";
import SoatIcon from "../../../assets/icons/soat.png";
import MaintainanceIcon from "../../../assets/icons/maintain.png";
import LicenceIcon from "../../../assets/icons/licence.png";
import RoadKit from "../../../assets/icons/road_kit.png";
import Tecno from "../../../assets/icons/tecno.png";
import InsuranceDetailsModal from "../InsuranceDetailsModal/InsuranceDetailsModal";
import SOATDetailModal from "../SOATDetailModal";
import TecnoDetailModal from "../TecnoDetailModal/TecnoDetailModal";
import RoadKitDetailModal from "../RoadKitDetailModal/RoadKitDetailModal";
import LicenseDetailModal from "../LicenseDetailModal/LicenseDetailModal";
import MaintenanceModal from "../../modals/MaintenanceModal";
import { useUserContext } from "../../../context/UserContext";
import { useVehiclesContext } from "../../../context/VehiclesContext";
import { useUserItemsContext } from "../../../context/UserItemsContext";

const Dashboard: React.FC = () => {
  const [showSOATModal, setShowSOATModal] = useState(false);
  const [showTecnoModal, setShowTecnoModal] = useState(false);
  const [showRoadKitModal, setShowRoadKitModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const { user } = useUserContext();
  const { vehicles, selectedVehicle, setSelectedVehicleByPlate } =
    useVehiclesContext();
  const { userItems } = useUserItemsContext();

  // Helper function to compute soat status based on expirationDate
  const getSoatStatus = (expDate?: string | null) => {
    if (!expDate) return "Vencido";
    const today = new Date();
    const exp = new Date(expDate);
    if (today > exp) return "Vencido";
    const diffDays = Math.ceil(
      (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diffDays <= 7 ? "Prox. vencer" : "Vigente";
  };

  // Retrieve soat item from selectedVehicle
  const soatItem = selectedVehicle?.vehicleItems.find(
    (item) => item.type.toLowerCase() === "soat",
  );
  const soatExpirationDate = soatItem?.expiryDate || "";
  const soatIssueDate = soatItem?.issueDate || "";
  const policyNumber = soatItem?.itemIdentifier || "";
  const licensePlate = selectedVehicle?.plate || "";
  const soatStatus = soatItem
    ? getSoatStatus(soatExpirationDate)
    : "Sin informacion";

  // Retrieve Tecno item for "Tecnico mecánica"
  const tecnoItem = selectedVehicle?.vehicleItems.find((item) =>
    item.type.toLowerCase().includes("tecno"),
  );
  const tecnoExpirationDate = tecnoItem?.expiryDate || "";
  const tecnoIssueDate = tecnoItem?.issueDate || "";
  const revisionNumber = tecnoItem?.itemIdentifier || "";
  const tecnoStatus = tecnoItem
    ? getSoatStatus(tecnoExpirationDate)
    : "Sin informacion";

  // Retrieve roadkit item for "Kit de carretera"
  const roadkitItem = selectedVehicle?.vehicleItems.find(
    (item) => item.type.toLowerCase() === "roadkit",
  );
  const roadkitExpirationDate = roadkitItem?.expiryDate || "28 Diciembre 2024";
  const roadkitStatus = roadkitItem
    ? getSoatStatus(roadkitExpirationDate)
    : "Sin informacion";

  // Retrieve insurance item for "Polizas de seguro"
  const insuranceItem = selectedVehicle?.vehicleItems.find(
    (item) => item.type.toLowerCase() === "insurance",
  );
  const insuranceIssueDate = insuranceItem?.issueDate || "";
  const insuranceStatus = insuranceItem
    ? getSoatStatus(insuranceItem.expiryDate)
    : "Sin informacion";

  // Retrieve license item from userItems context
  const licenseItem = userItems?.find(
    (item) => item.category.toLowerCase() === "license",
  );

  return (
    <section className="bg-white rounded-[25px] shadow-lg p-8 mx-8 my-12">
      <h2 className="text-2xl font-bold mb-2">Hola, {`${user?.name}`}</h2>

      {/* Horizontal list of plates */}
      <div className="flex overflow-x-auto space-x-2 mb-4">
        {vehicles?.map((vehicle) => (
          <span
            key={vehicle.plate}
            onClick={() => setSelectedVehicleByPlate(vehicle.plate)}
            className={`px-3 py-1 rounded-full text-sm font-semibold cursor-pointer 
              ${selectedVehicle?.plate === vehicle.plate ? "bg-gray-500 text-white" : "bg-gray-200 text-black"}`}
          >
            {vehicle.plate}
          </span>
        ))}
      </div>

      <p className="mb-6">
        Selecciona una de las categorías para gestionar un recordatorio
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        <div onClick={() => setShowSOATModal(true)} className="cursor-pointer">
          <Card
            // @ts-ignore
            icon={<img src={SoatIcon} alt="Soat Icon" width={30} height={30} />}
            title="Seguro SOAT"
            status={soatStatus}
          />
        </div>
        <div onClick={() => setShowTecnoModal(true)} className="cursor-pointer">
          <Card
            // @ts-ignore
            icon={<img src={Tecno} alt="tecno Icon" width={30} height={30} />}
            title="Tecnico mecánica"
            status={tecnoStatus}
          />
        </div>
        <div
          onClick={() => setShowLicenseModal(true)}
          className="cursor-pointer"
        >
          <Card
            // @ts-ignore
            icon={
              <img
                src={LicenceIcon}
                alt="license Icon"
                width={30}
                height={30}
              />
            }
            title="Licencia de conducción"
            status={
              licenseItem
                ? getSoatStatus(licenseItem.expiryDate)
                : "Sin informacion"
            }
          />
        </div>
        <div
          onClick={() => setShowRoadKitModal(true)}
          className="cursor-pointer"
        >
          <Card
            // @ts-ignore
            icon={
              <img src={RoadKit} alt="Roadkit Icon" width={30} height={30} />
            }
            title="Kit de carretera"
            status={roadkitStatus}
          />
        </div>
        <div
          onClick={() => setShowInsuranceModal(true)}
          className="cursor-pointer"
        >
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
            status={insuranceStatus}
          />
        </div>
        <div
          onClick={() => setShowMaintenanceModal(true)}
          className="cursor-pointer"
        >
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
      </div>
      {showSOATModal && (
        <SOATDetailModal
          onClose={() => setShowSOATModal(false)}
          status={soatStatus}
          expirationDate={soatExpirationDate}
          issueDate={soatIssueDate}
          policyNumber={policyNumber}
          licensePlate={licensePlate}
        />
      )}
      {showTecnoModal && (
        <TecnoDetailModal
          onClose={() => setShowTecnoModal(false)}
          status={tecnoStatus}
          expirationDate={tecnoExpirationDate}
          issueDate={tecnoIssueDate}
          revisionNumber={revisionNumber}
          licensePlate={licensePlate}
        />
      )}
      {showLicenseModal && (
        <LicenseDetailModal
          onClose={() => setShowLicenseModal(false)}
          licenseItem={licenseItem || null}
        />
      )}
      {showRoadKitModal && (
        <RoadKitDetailModal
          onClose={() => setShowRoadKitModal(false)}
          expirationDate={roadkitExpirationDate}
          status={roadkitStatus}
        />
      )}
      {showInsuranceModal && (
        <InsuranceDetailsModal
          onClose={() => setShowInsuranceModal(false)}
          status={insuranceStatus}
          issuanceDate={insuranceIssueDate}
          licensePlate={licensePlate}
        />
      )}
      {showMaintenanceModal && (
        <MaintenanceModal onClose={() => setShowMaintenanceModal(false)} />
      )}
    </section>
  );
};

export default Dashboard;
