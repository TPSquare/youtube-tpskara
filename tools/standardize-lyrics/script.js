const sensitiveMap = await fetch(`./sensitive-map.json?t=${Date.now()}`).then((res) => res.json());

const textarea = document.getElementById("input");
const standardizeBtn = document.body.querySelector("#standardize-btn-wrapper button");

standardizeBtn.onclick = () => {
  Standardize.separatedIntoLines();
  Standardize.disguiseSensitiveWords();
};

class Standardize {
  static separatedIntoLines() {
    const res = [];
    const rawLine = textarea.value.split("\n");
    for (let value of rawLine) {
      let i = 0;
      while (value.length > 0) {
        ++i;
        if (i >= value.length) {
          res.push(value);
          break;
        } else if (value[i].toLowerCase() !== value[i]) {
          if (value[i - 1] !== " " && value[i - 1].toLowerCase() !== value[i - 1]) continue;
          res.push(value.slice(0, i));
          value = value.slice(i);
          i = 0;
        }
      }
    }
    textarea.value = res.join("\n");
  }

  static disguiseSensitiveWords() {
    const res = textarea.value.split("");
    const lowerText = textarea.value.toLowerCase();
    for (const key in sensitiveMap) {
      let pos = lowerText.indexOf(key);
      while (pos !== -1) {
        for (const index of sensitiveMap[key]) res[pos + index] = "*";
        pos = lowerText.indexOf(key, pos + 1);
      }
    }
    textarea.value = res.join("");
  }
}
