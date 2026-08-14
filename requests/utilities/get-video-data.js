import environment from "../../internal/configs/environment.js";

const TMP_THUMBNAIL_URL = "https://tse4.mm.bing.net/th/id/OIP._k-Rbbqjzn5_zofRRV46YgHaEh";

let devIndex = 0;
export default async function getVideoData(id) {
  if (environment === "development")
    return { title: `*Video from Youtube ${++devIndex}`, thumbnailUrl: TMP_THUMBNAIL_URL };

  const api = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=AIzaSyDJvCeWiQP8gLQCiZGoQAOQvE9F-e1LIy8`;
  const videoData = await fetch(api).then((res) => res.json());

  if (!videoData.items || videoData.items.length === 0) {
    console.warn(`No data found for video ID: ${id}`);
    return { title: "Video không tồn tại hoặc đã bị ẩn", thumbnailUrl: TMP_THUMBNAIL_URL };
  }

  return {
    title: videoData.items[0].snippet.title,
    thumbnailUrl: videoData.items[0].snippet.thumbnails.medium.url,
  };
}
