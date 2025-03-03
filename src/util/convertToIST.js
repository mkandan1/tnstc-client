import { DateTime } from "luxon";

export const convertToIST = (isoString) => {
  if (!isoString) return "Invalid Date";

  return DateTime.fromISO(isoString, { zone: "utc" })
    .setZone("Asia/Kolkata")
    .toFormat("dd-MM-yyyy hh:mm:ss a");
};

export const getISTTime = (isoString) => {
  if (!isoString) return "-";

  return DateTime.fromISO(isoString, { zone: "utc" })
    .setZone("Asia/Kolkata")
    .toFormat("hh:mm a");
};