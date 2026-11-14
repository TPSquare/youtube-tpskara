import getVideoData from "../internal/utilities/get-yt-video-data.js";

export default async function createSongElement(id) {
  const songElement = document.createElement("a");
  songElement.className = "song";
  document.body.appendChild(songElement);

  const videoData = await getVideoData(id);
  songElement.title = videoData.title;
  songElement.href = `https://youtu.be/${id}`;

  const thumbnailElement = document.createElement("img");
  thumbnailElement.src = videoData.thumbnailUrl;
  thumbnailElement.alt = videoData.title;
  songElement.appendChild(thumbnailElement);

  const titleElement = document.createElement("div");
  titleElement.className = "title";
  titleElement.textContent = videoData.title;
  songElement.appendChild(titleElement);
}
