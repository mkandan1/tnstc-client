import { DateTime } from "luxon";

export const formatDateTime = (dateString) => {
  if (!dateString) return "";

  return DateTime.fromISO(dateString, { zone: "utc" })
    .toFormat("yyyy-MM-dd'T'HH:mm"); // Keep in UTC, no timezone shift
};
