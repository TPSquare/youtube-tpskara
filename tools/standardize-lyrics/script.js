const sensitiveMap = await fetch(`./sensitive-map.json?t=${Date.now()}`).then((res) => res.json());

const inputTextarea = document.getElementById("input");
const outputTextarea = document.getElementById("output");
const standardizeBtn = document.body.querySelector("#standardize-btn-wrapper button");

standardizeBtn.onclick = () => {
  outputTextarea.value = inputTextarea.value;
  Standardize.separatedIntoLines();
  Standardize.disguiseSensitiveWords();
};

class Standardize {
  static separatedIntoLines() {
    const value = outputTextarea.value;
    outputTextarea.value = value.split(/\s+(?=\p{Lu})/u).join("\n");
  }

  static disguiseSensitiveWords() {
    const value = outputTextarea.value;
    const pattern = new RegExp(Object.keys(sensitiveMap).join("|"), "gi");
    outputTextarea.value = value.replace(pattern, (matched) => {
      const replacement = sensitiveMap[matched.toLowerCase()];
      if (!replacement) return matched;
      if (matched === matched.toUpperCase()) return replacement.toUpperCase();
      if (matched[0] === matched[0].toUpperCase())
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      return replacement.toLowerCase();
    });
  }
}
