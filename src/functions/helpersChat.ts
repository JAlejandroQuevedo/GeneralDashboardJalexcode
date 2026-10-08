export const formatMessageTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  const today = new Date();

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  if (isToday) return "Hoy";

  const isThisYear = date.getFullYear() === today.getFullYear();
  const shortMonth = date
    .toLocaleDateString("es-MX", { month: "short" })
    .replace(".", "");

  if (isThisYear) {
    return `${date.getDate()} de ${shortMonth}`;
  } else {
    return `${date.getDate()}/${shortMonth}/${date.getFullYear()}`; // "10/mar/2025"
  }
};

export const getInitials = (name: string) => {
  if (!name) return "";
  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
};
