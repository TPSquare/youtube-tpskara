import gotoChooseLanguages from "../internal/utilities/goto-choose-languages.js";
import getLanguages from "../internal/utilities/get-languages.js";

const language = await getLanguages();

(async () => {
  document.head.querySelector("title").textContent += language.listOfRequests;

  const insertText = (query, text) => (document.body.querySelector(query).textContent = text);
  insertText("#about .description", language.description);
  insertText("#about > div:nth-child(6) .text", language.vietnam);
  insertText("#about .footer", language.thank);
  insertText("#requests > .title", language.listOfRequests.toUpperCase() + ":");
  insertText("#requests-list .empty", language.emptyOfRequests + "...");

  const insertHTML = (query, html) => (document.body.querySelector(query).innerHTML = html);
  const requestNotesList = language.requestNotes.map((e) => `<div>${e}</div>`).join("");
  insertHTML("#requests > .informations", requestNotesList);
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
  const requests = await fetch(`./requests.json?t=${Date.now()}`).then((res) => res.json());

  if (requests.length) requestsListElement.removeChild(requestsListElement.querySelector(".empty"));

  const createRequestPromises = requests.map((request) => createRequestElement(request, language));
  await Promise.all(createRequestPromises);
  requestsListElement
    .querySelectorAll(".order:not(.no-order)")
    .forEach((order, index) => (order.textContent = index + 1));
})();

(async () => {
  const copyrightStrike = await fetch("./copyright-strike.json").then((res) => res.json());
  if (copyrightStrike.length === 0) return;
  const copyrightStrikeElement = document.getElementById("copyright-strike");
  copyrightStrikeElement.classList.remove("hidden");
  copyrightStrikeElement.querySelector(".reason").textContent = language.copyrightStrike;
  copyrightStrikeElement.querySelector(".result").textContent =
    language.copyrightNotice.replace("{Xdate}", copyrightStrike[0]) + "!";
})();

(() => {
  const aboutButton = document.body.querySelector("#topbar .about-button");
  const aboutElement = document.getElementById("about");

  const overlayElement = document.getElementById("overlay");
  overlayElement.addEventListener("click", () => overlayElement.classList.remove("show"));

  aboutButton.onclick = () => {
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
  document.body.querySelector("#topbar .change-language").onclick = gotoChooseLanguages;
})();
