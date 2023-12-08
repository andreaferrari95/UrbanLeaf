import axios from "axios";
import _, { head } from "lodash";
import "../assets/styles/styles.scss";
import logo from "../assets/img/UrbanLeaf-Logo.png";
import icon from "../assets/img/planet-earth.ico";
import teleportAPI from "./API/teleport";

const logoImg = document.getElementById("logo");
logoImg.src = logo;

const iconImg = document.getElementById("icon");
iconImg.href = icon;

document.getElementById("search-button").addEventListener("click", () => {
  const searchInput = document.getElementById("search-input").value;

  axios
    .get(`https://api.unsplash.com/search/photos?query=${searchInput}`)
    .then((response) => {
      const resultContainer = document.getElementById("search-results");
      resultContainer.innerHTML = "";

      _.forEach(response.data, (result) => {
        const resultDiv = document.createElement("div");
        resultDiv.textContent = result.title;
        resultContainer.appendChild(resultDiv);
      });
    })
    .catch((error) => console.log(error));
});

console.log(teleportAPI());
