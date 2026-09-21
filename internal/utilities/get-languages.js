import gotoChooseLanguages from "./goto-choose-languages.js";

const getAPI = () => {
  const lang = localStorage.getItem("lang");
  if (!lang) gotoChooseLanguages();
  document.documentElement.setAttribute("lang", lang);
  const dataKey = window.location.pathname.replace("/youtube-tpskara", "").slice(1, -1);
  return `../internal/languages-data/${lang}/${dataKey}.json`;
};

export default async function getLanguages() {
  const API = getAPI();
  return await fetch(API).then((res) => res.json());
}

export async function getLastModifiedLanguages() {
  const API = getAPI();
  return (await fetch(API)).headers.get("Last-Modified");
}
