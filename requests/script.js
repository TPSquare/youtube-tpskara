(async () => {
  const api = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UC-_m5GLVvVOEUYkTknhdjzw&key=AIzaSyDJvCeWiQP8gLQCiZGoQAOQvE9F-e1LIy8`;
  const channelData = await fetch(api).then((res) => res.json());
  const statistics = channelData.items[0].statistics;
  const { viewCount, subscriberCount, videoCount } = statistics;
  const aboutElement = document.getElementById("about");
  aboutElement.querySelector(
    ".label.subscribers .text"
  ).textContent = `${subscriberCount} người đăng ký`;
  aboutElement.querySelector(".label.videos .text").textContent = `${videoCount} video`;
  aboutElement.querySelector(".label.views .text").textContent = `${viewCount} lượt xem`;
})();

import createRequestElement from "./utilities/create-request-element.js";
(async () => {
  const requestsListElement = document.getElementById("requests-list");
  const requests = await fetch(`./requests.json?time=${Date.now()}`)
    .then((res) => res.json())
    .then((reqs) => reqs.map(({ request, ...rest }) => ({ requestText: request, ...rest })));

  if (requests.length) requestsListElement.removeChild(requestsListElement.querySelector(".empty"));

  for (let i = 0; i < requests.length; i++) createRequestElement(requests[i], i + 1);
})();

(() => {
  const sidebarElement = document.getElementById("sidebar");

  const overlayElement = document.getElementById("overlay");
  overlayElement.addEventListener("click", () => overlayElement.classList.remove("show"));

  const aboutElement = document.getElementById("about");
  sidebarElement.querySelector(".about").onclick = () => {
    aboutElement.classList.toggle("show");
    overlayElement.classList.toggle("show");
    overlayElement.onclick = () => aboutElement.classList.remove("show");
  };

  window.onresize = () => {
    overlayElement.classList.remove("show");
    aboutElement.classList.remove("show");
  };
})();
