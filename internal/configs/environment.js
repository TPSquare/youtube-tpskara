const currentUrl = window.location.href;
let environment = "production";
if (!currentUrl.includes("youtube-tpskara")) environment = "development";
export default environment;
