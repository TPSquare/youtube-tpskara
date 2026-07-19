const configAPI = `./config.json?t=${Date.now()}`;
const config = await fetch(configAPI).then((res) => res.json());

import getLanguages from "../internal/utilities/get-languages.js";
const languages = await getLanguages();
document.getElementById("title").textContent = languages.noticesTitle + ":";
document.getElementById("notices").innerHTML = config.lock
  ? `<div>${languages.lock}</div>`
  : languages.notices.map((e) => `<div>${e}</div>`).join("");

const currentNoticesVersion = Number(localStorage.getItem("notices-version"));
if (currentNoticesVersion !== config.noticesVersion || config.lock)
  document.body.classList.add("show-notices");

const okBtn = document.getElementById("ok-btn");
if (config.lock) okBtn.parentElement.removeChild(okBtn);
else
  okBtn.onclick = () => {
    document.body.classList.remove("show-notices");
    localStorage.setItem("notices-version", config.noticesVersion);
  };

document.getElementById("notices-btn").onclick = () => {
  document.body.classList.add("show-notices");
};
