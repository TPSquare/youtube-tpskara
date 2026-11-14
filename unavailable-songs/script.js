import getLanguages from "../internal/utilities/get-languages.js";
const language = await getLanguages();
document.head.querySelector("title").textContent += language.title;
document.getElementById("title").textContent = language.title;
document.body.querySelector("#nav .request-list").textContent = language.listOfRequests;

import createSongElement from "./create-song-element.js";
const songIDs = await fetch(`./songs.json?t=${Date.now()}`).then((res) => res.json());
const songPromises = songIDs.map(createSongElement);
await Promise.all(songPromises);
