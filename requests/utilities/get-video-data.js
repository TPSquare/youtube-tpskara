import environment from "../../configs/environment.js";
export default async function getVideoData(id) {
  if (environment === "development") return { title: "*Video từ Youtube" };

  const api = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=AIzaSyDJvCeWiQP8gLQCiZGoQAOQvE9F-e1LIy8`;
  const videoData = await fetch(api).then((res) => res.json());
  return {
    title: videoData.items[0].snippet.title,
    thumbnailUrl: videoData.items[0].snippet.thumbnails.medium.url,
  };
}
