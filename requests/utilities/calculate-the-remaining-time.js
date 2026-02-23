export default function calculateTheRemainingTime(dateString = "hh:mm dd/mm/yyyy", daysToAdd) {
  const [timeParts, dayParts] = dateString.split(" ");
  const timeSegments = timeParts.split(":");
  const daySegments = dayParts.split("/");
  const hour = parseInt(timeSegments[0], 10);
  const minute = parseInt(timeSegments[1], 10);
  const day = parseInt(daySegments[0], 10);
  const month = parseInt(daySegments[1], 10) - 1;
  const year = parseInt(daySegments[2], 10);

  const startDate = new Date(year, month, day, hour, minute);
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