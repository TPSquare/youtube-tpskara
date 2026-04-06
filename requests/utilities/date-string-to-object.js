export default function dateStringToObject(dateString = "hh:mm dd/mm/yyyy") {
  const [timeParts, dayParts] = dateString.split(" ");
  const timeSegments = timeParts.split(":");
  const daySegments = dayParts.split("/");
  const hour = parseInt(timeSegments[0], 10);
  const minute = parseInt(timeSegments[1], 10);
  const day = parseInt(daySegments[0], 10);
  const month = parseInt(daySegments[1], 10) - 1;
  const year = parseInt(daySegments[2], 10);
  return new Date(year, month, day, hour, minute);
}
