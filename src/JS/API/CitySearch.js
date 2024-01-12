import axios from "axios";
import _, { head } from "lodash";

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", searchCity);

searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    searchCity();
  }
});

function searchCity() {
  const city = searchInput.value;

  axios
    .get(`https://api.teleport.org/api/cities/?search=${city}`)
    .then((response) => {
      const data = response.data;

      const href = _.get(
        data,
        '_embedded["city:search-results"][0]._links["city:item"].href'
      );
      axios
        .get(href)
        .then((response) => {
          const cityData = response.data;

          const fullName = _.get(cityData, "full_name");
          const lat = _.get(cityData, "location[latlon].latitude");
          const lon = _.get(cityData, "location[latlon].longitude");
          const population = _.get(cityData, "population");

          const urbanArea = _.get(cityData, "_links['city:urban_area'].href");

          axios.get(urbanArea).then((response) => {
            const urbanAreaData = response.data;

            const scores = _.get(urbanAreaData, "_links['ua:scores'].href");
            const summary = _.get(scores, "summary");
            console.log("urban area data:", urbanAreaData);

            const content = `<h1>${fullName}</h1>
          <p>Latitude: ${lat}</p>
          <p>Longitude: ${lon}</p>
          <p>Population: ${population}</p>;
           ${summary};`;

            const result = document.getElementById("search-results");
            result.innerHTML = content;
          });

          console.log("city data:", cityData);
          console.log("urban area:", urbanArea);

          console.log(summary);
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      console.error(error);
    });
}
