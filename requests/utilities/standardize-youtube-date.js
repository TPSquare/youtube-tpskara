export default function standardizeYoutubeDate(date) {
  if (!date) return;
  date = date.replace(" tháng ", "/").replace(", ", "/");
  const part = date.split(" ");
  const parse = (e) => e.padStart(2, "0");
  part[1] = part[1].split("/").map(parse).join("/");
  date = part.join(" ");
  return date;
}
