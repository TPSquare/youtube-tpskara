import getVideoData from "./get-video-data.js";
import calculateTheRemainingTime from "./calculate-the-remaining-time.js";
import environment from "../../internal/configs/environment.js";
import dateStringToObject from "./date-string-to-object.js";
import standardizeYoutubeDate from "./standardize-youtube-date.js";
import getTitleFromVideoPage from "./get-title-from-video-page.js";

const EXPIRATION = 30;

const requestsListElement = document.getElementById("requests-list");

export default async function createRequestElement(request, language, searchData) {
  const config = {
    // To find out what the configuration includes
    id: request.youtubeID || request.id, // ID for searching
    title: request.title, // Video title
    thumbnailUrl: request.thumbnailUrl, // Link to video thumbnail
    link: request.link, // Link to the video
    request: request.request, // Viewer's request
    priorities: request.priorities || (request.priority && [request.priority]), // The priorities of the request
    recordDate: request.recordDate, // Time the request was recorded   [hh:mm dd/mm/yyyy]
    waitingUpload: request.waitingUpload, // Waiting for the upload date [bool]
    uploadDate: standardizeYoutubeDate(request.uploadDate), // The time the karaoke video was uploaded   [hh:mm dd/mm/yyyy]
    uploadedID: request.uploadedID, // ID of the uploaded karaoke video
    cancel: request.cancel, // Reason for canceling the request
    previewIDs: request.previewIDs || (request.previewID && [request.previewID]), // Previews
  };
  if (request.youtubeID) {
    const videoData = await getVideoData(request.youtubeID);
    config.title = videoData.title;
    config.thumbnailUrl =
      videoData.thumbnailUrl || "https://tse4.mm.bing.net/th/id/OIP._k-Rbbqjzn5_zofRRV46YgHaEh";
    config.link = `https://youtu.be/${request.youtubeID}`;
  }
  let isUploaded = false;

  searchData.push({ title: config.title, id: config.id, thumbnailUrl: config.thumbnailUrl });

  const requestElement = document.createElement("div");
  requestElement.className = `request request-${config.id}`;
  requestElement.onclick = () => console.log(config.id);
  requestsListElement.appendChild(requestElement);

  const boxElement = document.createElement("div");
  boxElement.className = "box";
  requestElement.appendChild(boxElement);

  const orderElement = document.createElement("div");
  orderElement.className = "order";
  boxElement.appendChild(orderElement);
  const addNoOrder = () => orderElement.classList.add("no-order");

  const thumbnailElement = document.createElement("img");
  thumbnailElement.src = config.thumbnailUrl;
  thumbnailElement.alt = config.title;
  boxElement.appendChild(thumbnailElement);

  const infosElement = document.createElement("div");
  infosElement.className = "infos";
  boxElement.appendChild(infosElement);

  const titleElement = document.createElement("a");
  titleElement.className = "title";
  titleElement.title = config.title;
  titleElement.textContent = config.title;
  titleElement.href = config.link || "#";
  infosElement.appendChild(titleElement);

  const rightBottomElement = document.createElement("div");
  rightBottomElement.className = "bottom";
  infosElement.appendChild(rightBottomElement);

  if (config.request) {
    const requestTextElement = document.createElement("div");
    requestTextElement.classList = "request-text";
    requestTextElement.textContent = `${language.requestElement.request}: ${config.request}`;
    rightBottomElement.appendChild(requestTextElement);
  }

  const floatElement = document.createElement("div");
  floatElement.className = "float";
  requestElement.appendChild(floatElement);

  const addCancel = (text) => {
    titleElement.classList.add("cancel");
    floatElement.childNodes.forEach((child) => floatElement.removeChild(child));
    addNoOrder();

    const expiredElement = document.createElement("div");
    expiredElement.className = "cancel";
    expiredElement.textContent = text;
    floatElement.appendChild(expiredElement);
  };

  if (config.priorities) {
    for (const priority of config.priorities) {
      const priorityElement = document.createElement("div");
      priorityElement.className = "priority";
      priorityElement.innerHTML = priority.replaceAll(" ", "&nbsp;");
      floatElement.appendChild(priorityElement);
    }
  }

  if (config.recordDate) {
    const remainingData = calculateTheRemainingTime(config.recordDate, EXPIRATION);
    if (remainingData.isExpired) {
      addCancel(language.requestElement.expired);
    } else {
      const remainingElement = document.createElement("div");
      remainingElement.className = "remaining";
      floatElement.appendChild(remainingElement);

      const keyInUsed =
        Object.keys(remainingData).find((key) => remainingData[key] > 0) || "seconds";
      if (remainingData.days && remainingData.hours >= 12) ++remainingData.days;
      remainingElement.textContent = `${remainingData[keyInUsed]} ${language.requestElement.time[keyInUsed]}`;
      remainingElement.title = `${language.requestElement.expireRequest.replace("{Xday}", remainingElement.textContent)}!`;
    }
  }

  if (config.uploadDate) {
    const doneElement = document.createElement("div");
    doneElement.className = "done";
    doneElement.textContent = config.uploadDate;
    doneElement.title = `${language.requestElement.uploadVideo.replace("{Xdate}", config.uploadDate)}!`;
    floatElement.appendChild(doneElement);

    const uploadDate = dateStringToObject(config.uploadDate);
    const now = new Date();
    if (now > uploadDate) {
      isUploaded = true;
      addNoOrder();

      doneElement.textContent = language.requestElement.uploaded;
      doneElement.removeAttribute("title");
      if (config.uploadedID) {
        doneElement.classList.add("uploaded-link");
        doneElement.onclick = () =>
          (window.location.href = `https://youtu.be/${config.uploadedID}`);
      }
    }
  }

  if (config.waitingUpload) {
    const waitingElement = document.createElement("div");
    waitingElement.className = "waiting";
    waitingElement.textContent = language.requestElement.waitingUpload;
    floatElement.appendChild(waitingElement);
  }

  if (config.cancel) addCancel(config.cancel);

  if (config.previewIDs && !isUploaded) {
    const previewsElement = document.createElement("div");
    previewsElement.className = "previews";
    requestElement.appendChild(previewsElement);

    const titleElement = document.createElement("div");
    titleElement.className = "title";
    titleElement.textContent = language.requestElement.preview + ":";
    previewsElement.appendChild(titleElement);

    for (const previewID of config.previewIDs) {
      const itemElement = document.createElement("a");
      getTitleFromVideoPage(previewID).then((title) => (itemElement.textContent = title));
      itemElement.href = `../videos/${previewID}.html`;
      previewsElement.appendChild(itemElement);
    }
  }
}
