import axios from "axios";
import _ from "lodash";

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
