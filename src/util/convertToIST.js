import { DateTime } from "luxon";

export const convertToIST = (isoString) => {
  if (!isoString) return "Invalid Date";

  let date = DateTime.fromISO(isoString, { zone: "utc" });

  // Fallback in case Luxon fails to parse the input
  if (!date.isValid) {
    date = DateTime.fromMillis(Date.parse(isoString), { zone: "utc" });
  }

  return date.setZone("Asia/Kolkata").toFormat("dd-MM-yyyy hh:mm:ss a");
};

export const convertToISTTime = (isoString) => {
  if (!isoString) return "Invalid Date";

  const timeString = isoString.$date || isoString; // Extract date if stored as an object

  let date = DateTime.fromISO(timeString, { zone: "utc" });

  if (!date.isValid) {
      date = DateTime.fromMillis(Date.parse(timeString), { zone: "utc" });
  }

  return date.isValid
      ? date.setZone("Asia/Kolkata").toFormat("hh:mm a")
      : "Invalid Date";
};


export const convertISTtoUTC = (istString) => {
  if (!istString) return null;

  return DateTime.fromFormat(istString, "yyyy-MM-dd'T'HH:mm", { zone: "Asia/Kolkata" })
    .toUTC()
    .toISO({ suppressMilliseconds: true });
};

export const convertToISTForInput = (isoString) => {
  if (!isoString) return "";

  return DateTime.fromISO(isoString, { zone: "utc" })
    .setZone("Asia/Kolkata")
    .toFormat("yyyy-MM-dd'T'HH:mm"); // Correct format for input
};

export const getISTTime = (isoString) => {
  if (!isoString) return "-";

  return DateTime.fromISO(isoString, { zone: "utc" })
    .setZone("Asia/Kolkata")
    .toFormat("hh:mm a");
};