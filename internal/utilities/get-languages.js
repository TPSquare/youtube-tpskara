import gotoChooseLanguages from "./goto-choose-languages.js";
export default async function getLanguages() {
  const lang = localStorage.getItem("lang");
  if (!lang) gotoChooseLanguages();
  document.documentElement.setAttribute("lang", lang);

  const dataKey = window.location.pathname.replace("/youtube-tpskara", "").slice(1, -1);
  const languageApi = `../internal/languages-data/${lang}/${dataKey}.json`;
  return await fetch(languageApi).then((res) => res.json());
}
