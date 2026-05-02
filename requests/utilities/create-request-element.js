import getVideoData from "./get-video-data.js";
import calculateTheRemainingTime from "./calculate-the-remaining-time.js";
import environment from "../../internal/configs/environment.js";
import dateStringToObject from "./date-string-to-object.js";

const EXPIRATION = 30;

const requestsListElement = document.getElementById("requests-list");

export default async function createRequestElement(request, index, language) {
  const requestElement = document.createElement("div");
  requestElement.className = "request";
  requestsListElement.appendChild(requestElement);

  const config = {
    // To find out what the configuration includes.
    title: request.title,
    thumbnailUrl: request.thumbnailUrl,
    link: request.link,
    request: request.requestText,
    priorities: request.priorities || (request.priority ? [request.priority] : undefined),
    date: request.date, // hh:mm dd/mm/yyyy
    uploadDate: request.uploadDate, // hh:mm dd/mm/yyyy
  };
  if (request.youtubeID) {
    requestElement.onclick = () => console.log(request.youtubeID);
    const videoData = await getVideoData(request.youtubeID);
    config.title = videoData.title;
    config.thumbnailUrl = videoData.thumbnailUrl;
    if (environment !== "development") config.link = `https://youtu.be/${request.youtubeID}`;
  }

  const orderElement = document.createElement("div");
  orderElement.className = "order";
  orderElement.textContent = index + 1;
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
  rightElements.appendChild(titleElement);

  const rightBottomElement = document.createElement("div");
  rightBottomElement.className = "bottom";
  rightElements.appendChild(rightBottomElement);

  if (config.request) {
    const requestTextElement = document.createElement("div");
    requestTextElement.classList = "request-text";
    requestTextElement.textContent = `${language.requestElement.request}: ${config.request}`;
    rightBottomElement.appendChild(requestTextElement);
  }

  const floatElement = document.createElement("div");
  floatElement.className = "float";
  requestElement.appendChild(floatElement);

  if (config.priorities) {
    for (const priority of config.priorities) {
      const priorityElement = document.createElement("div");
      priorityElement.className = "priority";
      priorityElement.innerHTML = priority.replaceAll(" ", "&nbsp;");
      floatElement.appendChild(priorityElement);
    }
  }

  if (config.date) {
    const remainingData = calculateTheRemainingTime(config.date, EXPIRATION);
    if (remainingData.isExpired) {
      titleElement.classList.add("expired");
      floatElement.childNodes.forEach((child) => floatElement.removeChild(child));

      const expiredElement = document.createElement("div");
      expiredElement.className = "expired";
      expiredElement.textContent = language.requestElement.expired;
      floatElement.appendChild(expiredElement);
    } else {
      const remainingElement = document.createElement("div");
      remainingElement.className = "remaining";
      floatElement.appendChild(remainingElement);

      const keyInUsed =
        Object.keys(remainingData).find((key) => remainingData[key] > 0) || "seconds";

      remainingElement.textContent = `${remainingData[keyInUsed]} ${language.requestElement.time[keyInUsed]}`;
      if (remainingData.days === EXPIRATION - 1 && remainingData.hours !== 0)
        remainingElement.textContent += ` ${remainingData.hours} ${language.requestElement.time.hours}`;
      remainingElement.title = `${language.requestElement.expireRequest.replace("{Xday}", remainingElement.textContent)}!`;
    }
  }

  if (config.uploadDate) {
    const doneElement = document.createElement("div");
    doneElement.className = "done";
    doneElement.textContent = config.uploadDate;
    doneElement.title = `${language.requestElement.uploadVideo.replace("{Xday}", config.uploadDate)}!`;
    floatElement.appendChild(doneElement);

    const uploadDate = dateStringToObject(config.uploadDate);
    const now = new Date();
    if (now > uploadDate) {
      doneElement.textContent = language.requestElement.uploaded;
      doneElement.title = language.requestElement.uploaded;
    }
  }
}
