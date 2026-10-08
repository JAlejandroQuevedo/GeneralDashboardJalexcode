export const formatCurrency = (value: string) => {
  // Eliminamos caracteres que no sean dígitos o punto decimal
  const numericValue = value.replace(/[^\d.]/g, "");

  // Convertimos a número flotante
  const number = parseFloat(numericValue);
  if (isNaN(number)) return "";

  // Formateamos como moneda local
  return number.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });
};
