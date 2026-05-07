import languagesConfig from "../internal/languages-data/config.js";
const wrapperElement = document.getElementById("languages");
Object.keys(languagesConfig).forEach((key) => {
  const config = languagesConfig[key];

  const button = document.createElement("button");
  button.className = key;
  button.onclick = () => {
    localStorage.setItem("lang", key);
    const goto = localStorage.getItem("choose-languages-goto") || "../requests";
    localStorage.removeItem("choose-languages-goto");
    window.location.href = `${goto}`;
  };
  wrapperElement.appendChild(button);

  const img = document.createElement("img");
  img.src = `../internal/assets/language-flags/${key}.png`;
  img.alt = config.name;
  button.appendChild(img);

  const title = document.createElement("span");
  title.textContent = config.name;
  button.appendChild(title);
});
