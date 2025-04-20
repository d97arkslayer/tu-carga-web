import React, { useState, useEffect } from "react";
import { FaTimes, FaWrench } from "react-icons/fa";
import { COLORS } from "../../utils/constants";
import { useVehiclesContext } from "../../context/VehiclesContext";
import { quoteTiresService } from "../../services/whatsappService";
import { maintenanceAPI } from "../../services/api"; // Import the maintenanceAPI
import { toast } from "react-hot-toast"; // Assuming you use toast for notifications

interface MaintenanceModalProps {
  onClose: () => void;
}

type MaintenanceType = "oil_change" | "tire_change" | "other";

const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const inputStyle =
    "border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-lime-300 w-full";

  // Estilos adicionales para ocultar los controles de incremento/decremento en inputs numéricos
  const numberInputStyle = `${inputStyle} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`;

  // Función para formatear el precio en pesos colombianos
  const formatCurrencyToCOP = (value: string): string => {
    if (!value) return "";

    // Elimina cualquier carácter que no sea número
    const numericValue = value.replace(/[^\d]/g, "");

    // Convierte a número para formatear
    const number = parseInt(numericValue, 10);

    // Si no es un número válido, devuelve vacío
    if (isNaN(number)) return "";

    // Formatea el número con separador de miles
    return number.toLocaleString("es-CO");
  };

  // Función para manejar el cambio en el input de precio
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCurrencyToCOP(e.target.value);
    setOilPrice(formattedValue);
  };

  // Función para calcular el próximo cambio sugerido (5000 km más que el actual)
  const calculateNextMileage = (currentMileage: string): string => {
    if (!currentMileage || isNaN(Number(currentMileage))) {
      return "";
    }
    return String(Number(currentMileage) + 5000);
  };

  // Función para calcular el próximo cambio de llantas (1 año después)
  const calculateNextTireChangeDate = (lastChangeDate: string): string => {
    if (!lastChangeDate) {
      return "";
    }

    const date = new Date(lastChangeDate);
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  };

  // Función modificada para manejar cambios en kilometraje actual
  const handleCurrentMileageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    if (maintenanceType === "oil_change") {
      setOilCurrentMileage(value);
      setOilNextMileage(calculateNextMileage(value));
    } else if (maintenanceType === "tire_change") {
      setTireCurrentMileage(value);
    } else if (maintenanceType === "other") {
      setOtherCurrentMileage(value);
    }
  };

  // Animation effect when mounting
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const [maintenanceType, setMaintenanceType] =
    useState<MaintenanceType>("oil_change");

  // Oil Change state
  const [oilCurrentMileage, setOilCurrentMileage] = useState("");
  const [oilNextMileage, setOilNextMileage] = useState("");
  const [oilPrice, setOilPrice] = useState("");
  const [oilServiceCenter, setOilServiceCenter] = useState("");
  const [oilReminders, setOilReminders] = useState({
    twoMonths: false,
    fourMonths: false,
    sixMonths: false,
    customDate: "",
  });

  // Tire Change state
  const [tireLastChangeDate, setTireLastChangeDate] = useState("");
  const [tireNextChangeDate, setTireNextChangeDate] = useState("");
  const [tirePrice, setTirePrice] = useState("");
  const [tireServiceCenter, setTireServiceCenter] = useState("");
  const [tireCurrentMileage, setTireCurrentMileage] = useState(""); // Nuevo estado para kilometraje actual de llantas
  const [tireReminders, setTireReminders] = useState({
    oneDay: false,
    oneWeek: false,
    oneMonth: false,
    customDate: "",
  });

  // Other Maintenance state
  const [otherCurrentMileage, setOtherCurrentMileage] = useState("");
  const [otherServiceCenter, setOtherServiceCenter] = useState("");
  const [otherItems, setOtherItems] = useState<
    Array<{ description: string; price: string }>
  >([{ description: "", price: "" }]); // Inicializado con un elemento vacío por defecto

  const addOtherItem = () => {
    setOtherItems([...otherItems, { description: "", price: "" }]);
  };

  const updateOtherItem = (
    index: number,
    field: "description" | "price",
    value: string,
  ) => {
    const updatedItems = otherItems.map((item, idx) =>
      idx === index ? { ...item, [field]: value } : item,
    );
    setOtherItems(updatedItems);
  };

  const removeOtherItem = (index: number) => {
    // Evitar eliminar si es el último elemento
    if (otherItems.length > 1) {
      setOtherItems(otherItems.filter((_, idx) => idx !== index));
    }
  };

  const totalPrice = otherItems.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0,
  );

  // Closing animation
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  // Close modal when clicking on backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { selectedVehicle } = useVehiclesContext();

  const handleSubmit = async () => {
    if (!selectedVehicle || !selectedVehicle.id) {
      setError("No hay vehículo seleccionado");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      let maintenanceData: any = {
        vehicleId: selectedVehicle.id,
        type:
          maintenanceType === "oil_change"
            ? "oil_change"
            : maintenanceType === "tire_change"
              ? "tire_change"
              : "other",
      };

      if (maintenanceType === "oil_change") {
        // Prepare oil change data
        maintenanceData = {
          ...maintenanceData,
          price: parseFloat(oilPrice.replace(/[^\d]/g, "")),
          serviceCenter: oilServiceCenter || "No especificado",
          oilChange: {
            currentMileage: parseInt(oilCurrentMileage),
            nextMileage: parseInt(oilNextMileage),
          },
        };
      } else if (maintenanceType === "tire_change") {
        // Prepare tire change data
        maintenanceData = {
          ...maintenanceData,
          price: parseFloat(tirePrice || "0"),
          serviceCenter: tireServiceCenter || "No especificado",
          tireChange: {
            lastChangeDate: new Date(tireLastChangeDate).toISOString(),
            nextChangeDate: new Date(tireNextChangeDate).toISOString(),
            currentMileage: tireCurrentMileage
              ? parseInt(tireCurrentMileage)
              : undefined,
          },
        };
      } else if (maintenanceType === "other") {
        // Prepare other maintenance data
        const maintenanceItems = otherItems.map((item) => ({
          description: item.description,
          price: parseFloat(item.price),
          currentMileage: parseInt(otherCurrentMileage),
        }));

        maintenanceData = {
          ...maintenanceData,
          price: totalPrice,
          serviceCenter: otherServiceCenter || "No especificado",
          maintenanceItems,
        };
      }

      // Send data to API
      await maintenanceAPI.createMaintenance(maintenanceData);

      // Show success message
      toast.success("Mantenimiento registrado con éxito");

      // Close modal
      handleClose();
    } catch (err: any) {
      console.error("Error al registrar mantenimiento:", err);
      setError(err?.message || "Error al registrar el mantenimiento");
      toast.error("No se pudo registrar el mantenimiento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuote = () => {
    if (selectedVehicle) {
      quoteTiresService(selectedVehicle.plate);
    } else {
      setError("No hay vehículo seleccionado");
    }
  };

  // Helper functions for toggle switches instead of checkboxes
  const toggleOilReminder = (key: keyof typeof oilReminders) => {
    if (key !== "customDate") {
      setOilReminders((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
  };

  const toggleTireReminder = (key: keyof typeof tireReminders) => {
    if (key !== "customDate") {
      setTireReminders((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
  };

  // Verificar si los campos requeridos están llenos según el tipo de mantenimiento
  const isFormValid = () => {
    if (maintenanceType === "oil_change") {
      return oilCurrentMileage.trim() !== "" && oilPrice.trim() !== "";
    } else if (maintenanceType === "tire_change") {
      return tireLastChangeDate.trim() !== "";
    } else if (maintenanceType === "other") {
      return (
        otherCurrentMileage.trim() !== "" &&
        otherItems.length > 0 &&
        otherItems.every(
          (item) => item.description.trim() !== "" && item.price.trim() !== "",
        )
      );
    }
    return false;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-[20px] shadow-lg w-full max-w-2xl min-w-[500px] overflow-hidden border border-blue-100 transform transition-all duration-300"
        style={{
          animation: "0.3s ease-out 0s 1 normal forwards running fadeIn",
          maxHeight: "90vh",
          overflow: "auto",
          transform: isVisible ? "scale(100%)" : "scale(95%)",
          opacity: isVisible ? 1 : 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-10 py-6 flex justify-between items-center border-gray-200">
          <div className="flex items-center mt-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
              style={{ backgroundColor: "#C4F439" }}
            >
              {/* @ts-ignore */}
              <FaWrench className="text-2xl" />
            </div>
            <h3 className="font-bold text-xl">Mantenimiento</h3>
          </div>
          <button
            onClick={handleClose}
            className="bg-gray-100 p-2 rounded-full text-black hover:bg-gray-200 transition-colors"
          >
            {/* @ts-ignore */}
            <FaTimes size={24} />
          </button>
        </div>
        <div className="px-10 py-6">
          {/* Oil Change - Reorganized layout */}
          <div className="mx-8">
            {/* First row: Type and Current mileage */}
            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <label className="text-gray-700 mb-2 block">
                  Selecciona un elemento:
                </label>
                <select
                  className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-lime-300 w-full"
                  value={maintenanceType}
                  onChange={(e) =>
                    setMaintenanceType(e.target.value as MaintenanceType)
                  }
                >
                  <option value="oil_change">Aceite</option>
                  <option value="tire_change">Llantas</option>
                  <option value="other">Otros</option>
                </select>
              </div>
              <div className="w-1/2">
                <label className="text-gray-700 mb-2 block">
                  Kilometraje actual: <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Kilometraje actual (km)"
                  value={
                    maintenanceType === "oil_change"
                      ? oilCurrentMileage
                      : maintenanceType === "tire_change"
                        ? tireCurrentMileage
                        : otherCurrentMileage
                  }
                  onChange={handleCurrentMileageChange}
                  className={numberInputStyle}
                />
              </div>
            </div>

            {maintenanceType === "oil_change" && (
              <>
                {/* Second row: Next change and price */}
                <div className="flex gap-4 mb-4">
                  <div className="w-1/2">
                    <label className="text-gray-700 mb-2 block">
                      Próximo cambio sugerido:
                    </label>
                    <input
                      type="number"
                      placeholder="Próximo cambio sugerido (km)"
                      value={oilNextMileage}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        // Solo actualiza si el nuevo valor es mayor que el kilometraje actual
                        if (
                          !oilCurrentMileage ||
                          Number(newValue) > Number(oilCurrentMileage)
                        ) {
                          setOilNextMileage(newValue);
                        } else {
                          // Si es menor o igual, establece el valor mínimo (actual + 5000)
                          setOilNextMileage(
                            calculateNextMileage(oilCurrentMileage),
                          );
                        }
                      }}
                      min={
                        oilCurrentMileage
                          ? Number(oilCurrentMileage) + 5000
                          : 5000
                      }
                      className={numberInputStyle}
                    />
                    {oilCurrentMileage &&
                      oilNextMileage &&
                      Number(oilNextMileage) <= Number(oilCurrentMileage) && (
                        <small className="text-red-500 block mt-1">
                          El próximo cambio debe ser al menos 5000 km mayor al
                          kilometraje actual
                        </small>
                      )}
                  </div>
                  <div className="w-1/2">
                    <label className="text-gray-700 mb-2 block">
                      Precio: <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="text"
                        placeholder="0"
                        value={oilPrice}
                        onChange={handlePriceChange}
                        className={`${numberInputStyle} pl-7`}
                      />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <hr className="my-4 border-gray-200" />

                {/* Service center */}
                <div className="mb-4">
                  <label className="text-gray-700 mb-2 block">
                    Centro de servicio:
                  </label>
                  <input
                    type="text"
                    placeholder="Centro de servicio"
                    value={oilServiceCenter}
                    onChange={(e) => setOilServiceCenter(e.target.value)}
                    className={inputStyle}
                  />
                </div>

                {/* Divider */}
                <hr className="my-4 border-gray-200" />

                {/* Updated Reminder Toggles */}
                <div className="mb-4">
                  <h3 className="font-bold mb-4">Activar recordatorio</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">2 meses después</span>
                      <button
                        className={`w-12 h-6 rounded-full ${
                          oilReminders.twoMonths
                            ? "bg-[#C4F439]"
                            : "bg-gray-300"
                        } relative`}
                        onClick={() => toggleOilReminder("twoMonths")}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transform transition-all ${
                            oilReminders.twoMonths
                              ? "translate-x-6"
                              : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">4 meses después</span>
                      <button
                        className={`w-12 h-6 rounded-full ${
                          oilReminders.fourMonths
                            ? "bg-[#C4F439]"
                            : "bg-gray-300"
                        } relative`}
                        onClick={() => toggleOilReminder("fourMonths")}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transform transition-all ${
                            oilReminders.fourMonths
                              ? "translate-x-6"
                              : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">6 meses después</span>
                      <button
                        className={`w-12 h-6 rounded-full ${
                          oilReminders.sixMonths
                            ? "bg-[#C4F439]"
                            : "bg-gray-300"
                        } relative`}
                        onClick={() => toggleOilReminder("sixMonths")}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transform transition-all ${
                            oilReminders.sixMonths
                              ? "translate-x-6"
                              : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 w-1/2">
                    <label className="text-gray-700 block mb-2">
                      Ingresa una fecha de recordatorio
                    </label>
                    <input
                      type="date"
                      value={oilReminders.customDate}
                      onChange={(e) =>
                        setOilReminders((prev) => ({
                          ...prev,
                          customDate: e.target.value,
                        }))
                      }
                      className={inputStyle}
                    />
                  </div>
                </div>
              </>
            )}

            {maintenanceType === "tire_change" && (
              <>
                {/* Segunda sección: Último cambio y próximo cambio de llantas */}
                <div className="flex gap-4 mb-4">
                  <div className="w-1/2">
                    <label className="text-gray-700 mb-2 block">
                      Último cambio de llantas:{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      placeholder="Último cambio de llantas"
                      value={tireLastChangeDate}
                      onChange={(e) => {
                        setTireLastChangeDate(e.target.value);
                        setTireNextChangeDate(
                          calculateNextTireChangeDate(e.target.value),
                        );
                      }}
                      className={inputStyle}
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="text-gray-700 mb-2 block">
                      Próximo cambio de llantas:
                    </label>
                    <input
                      type="date"
                      placeholder="Próximo cambio de llantas"
                      value={tireNextChangeDate}
                      readOnly
                      className={`${inputStyle} bg-gray-50`}
                    />
                  </div>
                </div>

                {/* Línea divisoria */}
                <hr className="my-4 border-gray-200" />

                {/* Sección de recordatorios */}
                <div className="mb-4">
                  <h3 className="font-bold mb-4">Recordatorios</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">1 día antes</span>
                      <button
                        className={`w-12 h-6 rounded-full ${
                          tireReminders.oneDay ? "bg-[#C4F439]" : "bg-gray-300"
                        } relative`}
                        onClick={() => toggleTireReminder("oneDay")}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transform transition-all ${
                            tireReminders.oneDay
                              ? "translate-x-6"
                              : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">1 semana antes</span>
                      <button
                        className={`w-12 h-6 rounded-full ${
                          tireReminders.oneWeek ? "bg-[#C4F439]" : "bg-gray-300"
                        } relative`}
                        onClick={() => toggleTireReminder("oneWeek")}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transform transition-all ${
                            tireReminders.oneWeek
                              ? "translate-x-6"
                              : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">1 mes antes</span>
                      <button
                        className={`w-12 h-6 rounded-full ${
                          tireReminders.oneMonth
                            ? "bg-[#C4F439]"
                            : "bg-gray-300"
                        } relative`}
                        onClick={() => toggleTireReminder("oneMonth")}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transform transition-all ${
                            tireReminders.oneMonth
                              ? "translate-x-6"
                              : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 w-1/2">
                    <label className="text-gray-700 block mb-2">
                      Ingresa una fecha de recordatorio
                    </label>
                    <input
                      type="date"
                      value={tireReminders.customDate}
                      onChange={(e) =>
                        setTireReminders((prev) => ({
                          ...prev,
                          customDate: e.target.value,
                        }))
                      }
                      className={inputStyle}
                    />
                  </div>
                </div>

                {/* Campo oculto para precio y centro de servicio que necesitamos mantener para funcionalidad */}
                <div className="hidden">
                  <input
                    type="text"
                    value={tireServiceCenter}
                    onChange={(e) => setTireServiceCenter(e.target.value)}
                  />
                  <input
                    type="number"
                    value={tirePrice}
                    onChange={(e) => setTirePrice(e.target.value)}
                  />
                </div>
              </>
            )}

            {maintenanceType === "other" && (
              <>
                <div className="mb-6">
                  <label className="text-gray-700 mb-2 block">
                    Agregar elemento
                  </label>
                  <button
                    onClick={addOtherItem}
                    className="mb-2 mt-2 py-3 px-6 rounded-full bg-lime-400 text-black font-bold transition duration-300 hover:opacity-90 hover:scale-105"
                  >
                    + Agregar
                  </button>

                  {/* Column headers */}
                  <div className="flex gap-4 mb-2 items-center">
                    <div className="w-1/2 font-medium text-gray-700">
                      Descripción<span className="text-red-500">*</span>
                    </div>
                    <div className="w-1/2 font-medium text-gray-700">
                      Precio<span className="text-red-500">*</span>
                    </div>
                    <div className="w-8"></div>{" "}
                    {/* Spacer for remove button column */}
                  </div>

                  {otherItems.map((item, index) => (
                    <div key={index} className="flex gap-4 mb-2 items-center">
                      <input
                        type="text"
                        placeholder="Nombre descripción"
                        value={item.description}
                        onChange={(e) =>
                          updateOtherItem(index, "description", e.target.value)
                        }
                        className={`${inputStyle} w-1/2`}
                      />
                      <input
                        type="number"
                        placeholder="$$$$$$"
                        value={item.price}
                        onChange={(e) =>
                          updateOtherItem(index, "price", e.target.value)
                        }
                        className={`${inputStyle} w-1/2`}
                      />
                      <button
                        onClick={() => removeOtherItem(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        {/* @ts-ignore */}
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <div className="font-bold text-gray-700 mb-1">Total</div>
                  <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 inline-block w-auto font-medium">
                    ${totalPrice}
                  </span>
                </div>

                {/* Divider */}
                <hr className="my-4 border-gray-200" />

                <div className="mb-4 w-1/2">
                  <label className="text-gray-700 mb-2 block">
                    Centro de servicio:
                  </label>
                  <input
                    type="text"
                    placeholder="Centro de servicio"
                    value={otherServiceCenter}
                    onChange={(e) => setOtherServiceCenter(e.target.value)}
                    className={inputStyle}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        {/* Footer */}
        <hr className="my-4 border-gray-200 mx-10" />
        <div className="px-10 py-6">
          <div className="flex justify-start gap-4 mx-8">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              className={`py-3 px-6 rounded-full font-bold transition duration-300 ${
                isFormValid() && !isSubmitting
                  ? "bg-lime-400 text-black hover:opacity-90 hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
            {maintenanceType === "tire_change" && (
              <button
                onClick={handleQuote}
                className="py-3 px-6 rounded-full bg-black text-white font-bold transition duration-300 hover:opacity-90 hover:scale-105"
              >
                Cotizar
              </button>
            )}
          </div>

          {/* Display error message if there is one */}
          {error && (
            <div className="text-left mt-3 mx-8">
              <span className="text-red-500 text-sm">{error}</span>
            </div>
          )}

          {/* Mensaje de campos obligatorios */}
          <div className="text-left mt-3 mx-8">
            <span className="text-gray-500 text-sm">
              <span className="text-red-500">*</span> Campos obligatorios
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceModal;
