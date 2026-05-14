const main = document.body.querySelector("main");
const title = main.querySelector("div");
window.onresize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const videoHeight = Math.min(height, (width * 9) / 16);
  main.style.height = `${videoHeight}px`;
  title.style.fontSize = `${videoHeight / 30}px`;
};
window.onresize();

const headTitle = document.head.querySelector("title");
headTitle.textContent = title.textContent + headTitle.textContent;
