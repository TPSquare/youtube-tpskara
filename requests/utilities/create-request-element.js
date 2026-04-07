import getVideoData from "./get-video-data.js";
import calculateTheRemainingTime from "./calculate-the-remaining-time.js";
import environment from "../../configs/environment.js";
import dateStringToObject from "./date-string-to-object.js";

const EXPIRATION = 30;
const REMAINING_KEYS = {
  days: "ngày",
  hours: "giờ",
  minutes: "phút",
  seconds: "giây",
};

const requestsListElement = document.getElementById("requests-list");
const getRequestKey = (request) => request.youtubeID || request.link.slice(0, 50) + "...";

export default async function createRequestElement(request, order) {
  if (request.uploadDate) {
    const uploadDate = dateStringToObject(request.uploadDate);
    const now = new Date();
    if (now > uploadDate) {
      console.warn(`\`${getRequestKey(request)}\` is uploaded!`);
      return;
    }
  }

  const requestElement = document.createElement("div");
  requestElement.className = "request";
  requestsListElement.appendChild(requestElement);

  const config = {
    // To find out what the configuration includes.
    title: request.title,
    thumbnailUrl: request.thumbnailUrl,
    link: request.link,
    request: request.requestText,
    priority: request.priority,
    date: request.date, // hh:mm dd/mm/yyyy
    uploadDate: request.uploadDate, // hh:mm dd/mm/yyyy
  };
  if (request.youtubeID) {
    const videoData = await getVideoData(request.youtubeID);
    config.title = videoData.title;
    config.thumbnailUrl = videoData.thumbnailUrl;
    if (environment !== "development") config.link = `https://youtu.be/${request.youtubeID}`;
  }

  const orderElement = document.createElement("div");
  orderElement.className = "order";
  orderElement.textContent = order;
  requestElement.appendChild(orderElement);

  const thumbnailElement = document.createElement("img");
  thumbnailElement.src =
    config.thumbnailUrl || "https://tse4.mm.bing.net/th/id/OIP._k-Rbbqjzn5_zofRRV46YgHaEh";
  thumbnailElement.alt = config.title;
  requestElement.appendChild(thumbnailElement);

  const rightElements = document.createElement("div");
  rightElements.className = "right";
  requestElement.appendChild(rightElements);

  const titleElement = document.createElement("a");
  titleElement.className = "title";
  titleElement.title = config.title;
  titleElement.textContent = config.title;
  titleElement.href = config.link || "#";
  titleElement.target = config.link ? "_blank" : "_self";
  rightElements.appendChild(titleElement);

  const rightBottomElement = document.createElement("div");
  rightBottomElement.className = "bottom";
  rightElements.appendChild(rightBottomElement);

  if (config.request) {
    const requestTextElement = document.createElement("div");
    requestTextElement.classList = "request-text";
    requestTextElement.textContent = `Yêu cầu: ${config.request}`;
    rightBottomElement.appendChild(requestTextElement);
  }

  const floatElement = document.createElement("div");
  floatElement.className = "float";
  requestElement.appendChild(floatElement);

  if (config.priority) {
    const priorityElement = document.createElement("div");
    priorityElement.className = "priority";
    priorityElement.innerHTML = config.priority.replaceAll(" ", "&nbsp;");
    floatElement.appendChild(priorityElement);
  }

  if (config.date) {
    const remainingData = calculateTheRemainingTime(config.date, EXPIRATION);
    if (remainingData.isExpired) {
      console.warn(`\`${getRequestKey(request)}\` is expired!`);
      requestsListElement.removeChild(requestElement);
      return;
    } else {
      const remainingElement = document.createElement("div");
      remainingElement.className = "remaining";
      floatElement.appendChild(remainingElement);

      const keyInUsed = Object.keys(REMAINING_KEYS).find((key) => remainingData[key] > 0);

      remainingElement.textContent = `${remainingData[keyInUsed]} ${REMAINING_KEYS[keyInUsed]}`;
      if (remainingData.days === EXPIRATION - 1)
        remainingElement.textContent += ` ${remainingData.hours} ${REMAINING_KEYS.hours}`;
      remainingElement.title = `Yêu cầu của bạn sẽ hết hạn sau ${remainingElement.textContent} nữa!`;

      if (keyInUsed === "seconds") {
        remainingElement.title = `Yêu cầu của bạn sẽ hết hạn sau chưa đầy 1 phút nữa!`;
        let remainingSeconds = remainingData.seconds;
        const countdownID = setInterval(() => {
          if (remainingSeconds <= 0) {
            requestsListElement.removeChild(requestElement);
            clearInterval(countdownID);
          }
          remainingElement.textContent = `${--remainingSeconds} ${REMAINING_KEYS.seconds}`;
        }, 1000);
      }
    }
  }

  if (config.uploadDate) {
    const doneElement = document.createElement("div");
    doneElement.className = "done";
    doneElement.textContent = config.uploadDate;
    doneElement.title = `Video sẽ được đăng tải vào lúc ${config.uploadDate}!`;
    floatElement.appendChild(doneElement);
  }
}
