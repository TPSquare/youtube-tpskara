import getLanguages from "../internal/utilities/get-languages.js";

const languages = await getLanguages();
document.getElementById("title").textContent = languages.noticesTitle + ":";
document.getElementById("notices").innerHTML = languages.notices.map((e) => `<div>${e}</div>`);

const api = `./notices-verison.json?t=${Date.now()}`;
const noticesVersion = await fetch(api).then((res) => res.json());
const currentNoticesVersion = Number(localStorage.getItem("notices-version"));
if (currentNoticesVersion !== noticesVersion) document.body.classList.add("show-notices");

document.getElementById("ok-btn").onclick = () => {
  document.body.classList.remove("show-notices");
  localStorage.setItem("notices-version", noticesVersion);
};

document.getElementById("notices-btn").onclick = () => {
  document.body.classList.add("show-notices");
};
