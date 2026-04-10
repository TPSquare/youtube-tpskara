export default function refreshRequestOrder() {
  const orderElms = document.body.querySelectorAll("#requests-list .request .order");
  orderElms.forEach((e, i) => (e.textContent = i + 1));
}
