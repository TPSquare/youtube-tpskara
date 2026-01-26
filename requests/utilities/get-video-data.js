export default async function getVideoData(id) {
  const api = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=AIzaSyDJvCeWiQP8gLQCiZGoQAOQvE9F-e1LIy8`;
  const videoData = await fetch(api).then((res) => res.json());
  return videoData.items[0];
}
