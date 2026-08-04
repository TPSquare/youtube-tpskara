const copyrightStrikesResponse = await fetch(`./copyright-strikes.json?t=${Date.now()}`);
const copyrightStrikes = (await copyrightStrikesResponse.json()).map((e) => e.toLowerCase());

const searchByNameInput = document.getElementById("name-search");
const resultElement = document.getElementById("result");

searchByNameInput.onkeyup = function ({ target }) {
  const value = target.value.trim().toLowerCase();
  if (value === "") return (resultElement.innerHTML = "");
  const coincidences = copyrightStrikes.filter((e) => e.includes(value));
  resultElement.innerHTML = coincidences.join("<br>");
};
