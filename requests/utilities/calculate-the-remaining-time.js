import dateStringToObject from "./date-string-to-object.js";

export default function calculateTheRemainingTime(dateString = "hh:mm dd/mm/yyyy", daysToAdd) {
  const startDate = dateStringToObject(dateString);
  const targetDate = new Date(startDate);
  targetDate.setDate(startDate.getDate() + daysToAdd);

  const now = new Date();
  const diffInMs = targetDate - now;

  if (diffInMs <= 0) return { isExpired: true };
  const seconds = Math.floor((diffInMs / 1000) % 60);
  const minutes = Math.floor((diffInMs / (1000 * 60)) % 60);
  const hours = Math.floor((diffInMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return { isExpired: false, days, hours, minutes, seconds };
}
