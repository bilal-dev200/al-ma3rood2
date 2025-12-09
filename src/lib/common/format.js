export const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") return "-";

  const numberValue = Number(value);
  if (isNaN(numberValue)) return "-";

  return numberValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatSaudiTime = (timeString) => {
  // convert "YYYY-MM-DD HH:mm:ss" → "YYYY-MM-DDTHH:mm:ssZ"
  const formatted = timeString.replace(" ", "T") + "Z";

  return new Date(formatted).toLocaleString("en-US", {
    timeZone: "Asia/Riyadh",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};