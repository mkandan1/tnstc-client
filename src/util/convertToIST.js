export const convertToIST = (isoString) => {
  if (!isoString) return "Invalid Date";

  return new Date(isoString).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};
export const getISTTime = (isoString) => {
  if (!isoString) return "-"; // Handle null or undefined values

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "-"; // Handle invalid dates

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
