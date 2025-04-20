// WhatsApp Service - Centralización de mensajes a WhatsApp
// Este servicio maneja todos los envíos de mensajes a WhatsApp en la aplicación

// Número de WhatsApp centralizado para todas las comunicaciones
const WHATSAPP_NUMBER = "573151957777";

/**
 * Envía un mensaje a WhatsApp utilizando la API de wa.me
 * @param message - El mensaje a enviar
 * @param phoneNumber - Número opcional (usa el número predeterminado si no se proporciona)
 */
export const sendWhatsAppMessage = (
  message: string,
  phoneNumber: string = WHATSAPP_NUMBER,
): void => {
  // Codifica el mensaje para usarlo en una URL
  const encodedMessage = encodeURIComponent(message);

  // Crea la URL de WhatsApp
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  // Abre WhatsApp en una nueva pestaña
  window.open(whatsappUrl, "_blank");
};

// Funciones específicas para diferentes casos de uso

/**
 * Solicitar servicio de grúa
 */
export const requestTowService = (): void => {
  const message = "Hola quiero solicitar un servicio de grúa";
  sendWhatsAppMessage(message);
};

/**
 * Cotizar revisión técnica para un vehículo
 * @param licensePlate - Placa del vehículo
 */
export const quoteTecnoService = (licensePlate: string): void => {
  const message = `Hola quiero contizar la revisión para el vehiculo de placa: ${licensePlate}`;
  sendWhatsAppMessage(message);
};

/**
 * Cotizar SOAT para un vehículo
 * @param licensePlate - Placa del vehículo
 */
export const quoteSOATService = (licensePlate: string): void => {
  const message = `Hola quiero contizar el SOAT para el vehiculo de placa: ${licensePlate}`;
  sendWhatsAppMessage(message);
};

/**
 * Cotizar llantas para un vehículo
 * @param licensePlate - Placa del vehículo
 */
export const quoteTiresService = (licensePlate: string): void => {
  const message = `Hola quiero cotizar unas llantas para el vehiculo de placas: ${licensePlate}`;
  sendWhatsAppMessage(message);
};

/**
 * Cotizar licencia
 * @param id - Identificación del usuario
 * @param category - Categoría de la licencia
 */
export const quoteLicenseService = (id: string, category: string): void => {
  const message = `Hola, quiero cotizar la licencia con identificación ${id} y categoría ${category}`;
  sendWhatsAppMessage(message);
};
