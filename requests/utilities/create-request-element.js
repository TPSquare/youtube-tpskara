import getVideoData from "./get-video-data.js";
import calculateTheRemainingTime from "./calculate-the-remaining-time.js";

const requestsListElement = document.getElementById("requests-list");
const remainingKeys = {
  days: "ngày",
  hours: "giờ",
  minutes: "phút",
  seconds: "giây",
};

export default async function createRequestElement(request, order) {
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
    date: request.date, // dd/mm/yyyy
  };
  if (request.youtubeID) {
    const { snippet } = await getVideoData(request.youtubeID);
    config.title = snippet.title;
    config.thumbnailUrl = snippet.thumbnails.medium.url;
    config.link =
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(snippet.title).replace(/%20/g, "+");
  }

  const orderElement = document.createElement("div");
  orderElement.className = "order";
  orderElement.textContent = order;
  requestElement.appendChild(orderElement);

  const thumbnailElement = document.createElement("img");
  thumbnailElement.src = config.thumbnailUrl;
  thumbnailElement.alt = config.title;
  requestElement.appendChild(thumbnailElement);

  const rightElements = document.createElement("div");
  rightElements.className = "right";
  requestElement.appendChild(rightElements);

  const titleElement = document.createElement("a");
  titleElement.className = "title";
  titleElement.title = config.title;
  titleElement.textContent = config.title;
  titleElement.href = config.link;
  titleElement.target = "_blank";
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

  if (config.priority) {
    const priorityElement = document.createElement("div");
    priorityElement.className = "priority";
    priorityElement.innerHTML = config.priority.replaceAll(" ", "&nbsp;");
    requestElement.appendChild(priorityElement);
  }

  if (config.date) {
    const remainingData = calculateTheRemainingTime(config.date, 30);
    if (remainingData.isExpired) {
      console.error(`\`${request.youtubeID || request.link.slice(0, 50) + "..."}\` is expired!`);
      requestsListElement.removeChild(requestElement);
    } else {
      const remainingElement = document.createElement("div");
      remainingElement.className = "remaining";
      requestElement.appendChild(remainingElement);

      const keyInUsed = Object.keys(remainingKeys).find((key) => remainingData[key] > 0);
      remainingElement.textContent = `${remainingData[keyInUsed]} ${remainingKeys[keyInUsed]}`;
      remainingElement.title = `Yêu cầu của bạn sẽ hết hạn sau ${remainingElement.textContent} nữa!`;

      if (keyInUsed === "seconds") {
        remainingElement.title = `Yêu cầu của bạn sẽ hết hạn sau chưa đầy 1 phút nữa!`;
        let remainingSeconds = remainingData.seconds;
        const countdownID = setInterval(() => {
          if (remainingSeconds <= 0) {
            requestsListElement.removeChild(requestElement);
            clearInterval(countdownID);
          }
          remainingElement.textContent = `${--remainingSeconds} ${remainingKeys.seconds}`;
        }, 1000);
      }
    }
  }
}
