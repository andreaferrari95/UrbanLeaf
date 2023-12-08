import axios from "axios";
import _, { head } from "lodash";
import Bloodhound from "typeahead.js/dist/bloodhound.min";
import autocomplete from "typeahead.js/dist/typeahead.jquery.min";
// Searching for Cities by Name

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

function handleSearch() {
  const city = searchInput.value;
  openCityPage(city);
}

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

searchButton.addEventListener("click", handleSearch);

const city = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace("name"),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    url: "https://api.teleport.org/api/cities/?search=%QUERY",
    wildcard: "%QUERY",
  },
});

$("#searchInput").typeahead(null, {
  name: "city",
  display: "name",
  source: city,
  limit: 10,
});

/*function openCityPage(city) {
  const teleportCityUrl = `https://www.teleport.org/cities/?search=${encodeURIComponent(
    city
  )}`;

  axios
    .get(teleportCityUrl)
    .then((response) => {
      const data = response.data;

      window.location.href = "city-detail.html";
    })
    .catch((error) => {
      console.error(error);
    });
}
*/

export default city;
// Basic information about a city

// Life quality Data for Urban Area
