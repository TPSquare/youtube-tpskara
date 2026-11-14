import dateStringToObject from "../internal/utilities/date-string-to-object.js";

const configAPI = `./config.json?t=${Date.now()}`;
const config = await fetch(configAPI).then((res) => res.json());

if (config.lockDate) {
  const unlockDate = dateStringToObject(config.lockDate);
  if (unlockDate.getTime() < Date.now()) config.lockDate = null;
}

import getLanguages, { getLastModifiedLanguages } from "../internal/utilities/get-languages.js";
const languages = await getLanguages();
document.getElementById("title").textContent = languages.noticesTitle + ":";
document.body.querySelector("#nav .request-list").textContent = languages.listOfRequests;
document.getElementById("notices").innerHTML = config.lockDate
  ? `<div>${languages.lock.replace("{X}", config.lockDate)}</div>`
  : languages.notices.map((e) => `<div>${formatNotice(e)}</div>`).join("");
function formatNotice(notice) {
  while (notice.includes("*")) {
    notice = notice.replace("*", "<strong>");
    notice = notice.replace("*", "</strong>");
  }
  return notice;
}

const currentNoticesVersion = localStorage.getItem("notices-version");
const languagesVersion = await getLastModifiedLanguages();
if (currentNoticesVersion === languagesVersion && !config.lockDate)
  document.body.classList.remove("show-notices");

if (config.lockDate) {
  const main = document.body.querySelector("main");
  main.removeChild(document.getElementById("title"));
  main.removeChild(document.getElementById("bottom-bar"));
} else
  document.getElementById("ok-btn").onclick = () => {
    document.body.classList.remove("show-notices");
    localStorage.setItem("notices-version", languagesVersion);
  };

document.body.querySelector("#nav .notices-btn").onclick = () => {
  document.body.classList.add("show-notices");
};
