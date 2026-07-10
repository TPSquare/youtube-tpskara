export default async function getTitleFromVideoPage(id) {
  const HTML = await fetch(`../videos/${id}.html`).then((res) => res.text());
  const title = HTML.slice(HTML.indexOf("<div>") + 5, HTML.indexOf("</div>"));
  return title;
}
