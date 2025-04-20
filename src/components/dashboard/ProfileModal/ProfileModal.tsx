// src/components/dashboard/ProfileModal/ProfileModal.tsx
import React, { useState } from "react";
import { COLORS } from "../../../utils/constants";
import { FaUser, FaCar, FaClipboardList, FaSignOutAlt } from "react-icons/fa";
import VehiclesInformationModal from "../VehiclesInformation/VehiclesInformationModal";
import MaintenanceReportModal from "../MaintenanceReportModal/MaintenanceReportModal";
import { useVehiclesContext } from "../../../context/VehiclesContext";

interface ProfileModalProps {
  username: string;
  onClose: () => void;
  onMenuItemClick: (action: string) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  username,
  onClose,
  onMenuItemClick,
}) => {
  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const [showVehiclesInformationModal, setShowInformationModal] =
    useState(false);
  const [showMaintenanceReportModal, setShowMaintenanceReportModal] =
    useState(false);

  const { vehicles, selectedVehicle, setSelectedVehicleByPlate } =
    useVehiclesContext();

  return (
    <>
      <div className="fixed inset-0 z-50" onClick={handleBackdropClick}>
        <div
          className="absolute top-16 right-40 bg-white rounded-[20px] shadow-lg w-64 overflow-hidden border border-blue-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* User Info Header */}
          <div className="p-4 flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: COLORS.primary }}
            >
              {/* @ts-ignore */}
              <FaUser size={24} color={COLORS.black} />
            </div>
            <h3 className="font-bold text-lg">{username}</h3>
          </div>

          <hr className="border-gray-200" />

          {/* Menu Items */}
          <div className="p-2">
            <button
              className="w-full text-left px-4 py-3 flex items-center hover:bg-gray-100 rounded-lg"
              onClick={() => setShowInformationModal(true)}
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                {/* @ts-ignore */}
                <FaCar size={16} color={COLORS.black} />
              </div>
              <span>Información del vehiculo</span>
            </button>

            <button
              className="w-full text-left px-4 py-3 flex items-center hover:bg-gray-100 rounded-lg"
              onClick={() => setShowMaintenanceReportModal(true)}
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                {/* @ts-ignore */}
                <FaClipboardList size={16} color={COLORS.black} />
              </div>
              <span>Reporte de mantenimiento</span>
            </button>

            <button
              className="w-full text-left px-4 py-3 flex items-center hover:bg-gray-100 rounded-lg"
              onClick={() => onMenuItemClick("logout")}
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                {/* @ts-ignore */}
                <FaSignOutAlt size={16} color={COLORS.black} />
              </div>
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>
      {showVehiclesInformationModal && (
        <VehiclesInformationModal
          vehicles={vehicles}
          selectedVehicle={selectedVehicle}
          setSelectedVehicleByPlate={setSelectedVehicleByPlate}
          onClose={() => setShowInformationModal(false)}
        ></VehiclesInformationModal>
      )}
      {showMaintenanceReportModal && (
        <MaintenanceReportModal
          onClose={() => setShowMaintenanceReportModal(false)}
        />
      )}
    </>
  );
};

export default ProfileModal;
