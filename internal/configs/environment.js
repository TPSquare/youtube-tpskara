const currentUrl = window.location.href;
let environment = "production";
if (currentUrl.includes(":5500")) environment = "development";
export default environment;
