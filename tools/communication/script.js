class Communication {
  static #createTextElement() {
    const boxElement = document.createElement("div");
    boxElement.className = "box";
    document.body.appendChild(boxElement);

    const copyButton = document.createElement("button");
    copyButton.className = "copy";
    copyButton.title = "Copy";
    copyButton.textContent = "Copy";
    copyButton.onclick = () => {
      navigator.clipboard.writeText(preElement.textContent);
      copyButton.textContent = "Copied!";
      setTimeout(() => (copyButton.textContent = "Copy"), 1000);
    };
    boxElement.appendChild(copyButton);

    const preElement = document.createElement("pre");
    boxElement.appendChild(preElement);
    return preElement;
  }
  static async createText(filename) {
    const textElement = this.#createTextElement();
    const text = await fetch(`./texts/${filename}.txt`).then((res) => res.text());
    textElement.textContent = text;
  }
  static addHorizontalSpace() {
    const spaceElement = document.createElement("div");
    spaceElement.className = "space";
    document.body.appendChild(spaceElement);
  }
}

Communication.createText("en-video-description");
Communication.addHorizontalSpace();
Communication.createText("vi-accept-request");
Communication.createText("en-accept-request");
Communication.addHorizontalSpace();
Communication.createText("vi-thank-donation");
Communication.createText("en-thank-donation");
Communication.addHorizontalSpace();
Communication.createText("vi-1-month");
Communication.createText("en-1-month");
Communication.addHorizontalSpace();
Communication.createText("vi-hieuthuhai");
