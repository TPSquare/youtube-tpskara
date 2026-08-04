const getTime = (timeString) => {
  const timeSegments = timeString.split(":");
  const hour = parseInt(timeSegments[0], 10);
  const minute = parseInt(timeSegments[1], 10);
  return { hour, minute };
};

const getDay = (dayString) => {
  const daySegments = dayString.split("/");
  const day = parseInt(daySegments[0], 10);
  const month = parseInt(daySegments[1], 10) - 1;
  const year = parseInt(daySegments[2], 10);
  return { day, month, year };
};

export default function dateStringToObject(dateString = "hh:mm dd/mm/yyyy") {
  if (dateString.includes(" ")) {
    const [timeString, dayString] = dateString.split(" ");
    const { hour, minute } = getTime(timeString);
    const { day, month, year } = getDay(dayString);
    return new Date(year, month, day, hour, minute);
  } else {
    const { day, month, year } = getDay(dateString);
    return new Date(year, month, day);
  }
}
