import environment from "../configs/environment.js";
(async () => {
  if (environment === "development") return;
  const api = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UC-_m5GLVvVOEUYkTknhdjzw&key=AIzaSyDJvCeWiQP8gLQCiZGoQAOQvE9F-e1LIy8`;
  const channelData = await fetch(api).then((res) => res.json());
  const statistics = channelData.items[0].statistics;
  const { viewCount, subscriberCount, videoCount } = statistics;
  const aboutElement = document.getElementById("about");
  aboutElement.querySelector(".label.subscribers .text").textContent =
    `${Number(subscriberCount).toLocaleString("vi-VN")} người đăng ký`;
  aboutElement.querySelector(".label.videos .text").textContent =
    `${Number(videoCount).toLocaleString("vi-VN")} video`;
  aboutElement.querySelector(".label.views .text").textContent =
    `${Number(viewCount).toLocaleString("vi-VN")} lượt xem`;
})();

import createRequestElement from "./utilities/create-request-element.js";
import refreshRequestOrder from "./utilities/refresh-request-order.js";
(async () => {
  const requestsListElement = document.getElementById("requests-list");
  const requests = await fetch(`./requests.json?t=${Date.now()}`)
    .then((res) => res.json())
    .then((reqs) => reqs.map(({ request, ...rest }) => ({ requestText: request, ...rest })));


  const requestPromises = requests.map((req) => createRequestElement(req, refreshRequestOrder));
  await Promise.all(requestPromises);
  refreshRequestOrder();
  if (requests.length) requestsListElement.removeChild(requestsListElement.querySelector(".empty"));
  requestsListElement.appendChild(requestsListElement.querySelector(".margin"));
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
