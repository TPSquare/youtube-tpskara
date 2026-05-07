export default function gotoChooseLanguages() {
  localStorage.setItem("choose-languages-goto", window.location.pathname);
  window.location.href = "../choose-languages";
}
