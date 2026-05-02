const changeLanguage = () => {
  localStorage.setItem("choose-languages-goto", "requests");
  window.location.href = "../choose-languages?goto=requests";
};

const lang = localStorage.getItem("lang");
if (!lang) changeLanguage();
const languageApi = `../internal/languages-data/${lang}/requests-page.json`;
const language = await fetch(languageApi).then((res) => res.json());

(async () => {
  document.documentElement.setAttribute("lang", lang);
  document.head.querySelector("title").textContent += language.listOfRequests;

  const insertText = (query, text) => (document.body.querySelector(query).textContent = text);
  insertText("#about .description", language.description);
  insertText("#about > div:nth-child(6) .text", language.vietnam);
  insertText("#about .footer", language.thank);
  insertText("#requests > .title", language.listOfRequests.toUpperCase() + ":");
  insertText("#requests-list .empty", language.emptyOfRequests + "...");

  const insertHTML = (query, html) => (document.body.querySelector(query).innerHTML = html);
  const notesToListOfRequestsHTML = language.notesToListOfRequests.map((e) => `<div>${e}</div>`);
  insertHTML("#requests > .informations", notesToListOfRequestsHTML.join());
})();

import environment from "../internal/configs/environment.js";
(async () => {
  if (environment === "development") return;
  const api = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UC-_m5GLVvVOEUYkTknhdjzw&key=AIzaSyDJvCeWiQP8gLQCiZGoQAOQvE9F-e1LIy8`;
  const channelData = await fetch(api).then((res) => res.json());
  const statistics = channelData.items[0].statistics;
  const { viewCount, subscriberCount, videoCount } = statistics;
  const aboutElement = document.getElementById("about");
  aboutElement.querySelector(".label.subscribers .text").textContent =
    `${Number(subscriberCount).toLocaleString("vi-VN")} ${language.subscribers.toLowerCase()}`;
  aboutElement.querySelector(".label.videos .text").textContent =
    `${Number(videoCount).toLocaleString("vi-VN")} ${language.videos.toLowerCase()}`;
  aboutElement.querySelector(".label.views .text").textContent =
    `${Number(viewCount).toLocaleString("vi-VN")} ${language.views.toLowerCase()}`;
})();

import createRequestElement from "./utilities/create-request-element.js";
(async () => {
  const requestsListElement = document.getElementById("requests-list");
  const requests = await fetch(`./requests.json?t=${Date.now()}`)
    .then((res) => res.json())
    .then((reqs) => reqs.map(({ request, ...rest }) => ({ requestText: request, ...rest })));

  if (requests.length) requestsListElement.removeChild(requestsListElement.querySelector(".empty"));

  for (let index = 0; index < requests.length; index++)
    createRequestElement(requests[index], index, language);
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

(() => {
  document.body.querySelector("#tool-bar .change-language").onclick = changeLanguage;
})();
