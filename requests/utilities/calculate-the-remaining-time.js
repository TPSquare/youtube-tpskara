export default function calculateTheRemainingTime(dateString, daysToAdd) {
  const parts = dateString.split("/");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const startDate = new Date(year, month, day);
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
