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


export const getISTTime = (isoString) => {
  if (!isoString) return "-";

  return DateTime.fromISO(isoString, { zone: "utc" })
    .setZone("Asia/Kolkata")
    .toFormat("hh:mm a");
};