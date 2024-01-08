import axios from "axios";
import _, { head } from "lodash";

function defaultCity() {
  const defcity = document.getElementById("city");
  const defSummary = document.getElementById("city-description");
  axios
    .get(`https://api.teleport.org/api/cities/?search=rome&limit=1`)
    .then((response) => {
      const data = response.data;

      const defCityHref = _.get(
        data,
        '_embedded["city:search-results"][0]._links["city:item"].href'
      );
      axios
        .get(defCityHref)
        .then((response) => {
          const cityData = response.data;

          const fullName = _.get(cityData, "full_name");
          const lat = _.get(cityData, "location[latlon].latitude");
          const lon = _.get(cityData, "location[latlon].longitude");
          defcity.innerHTML = fullName;

          axios
            .get(
              `http://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key={{4fb35cd8-01d9-4068-a090-0634e06a0e4a}}`
            )
            .then((response) => {
              const defWeatherData = response.data;

              const defWeather = _.get(defWeatherData, "data.current.weather");
              console.log(defWeather);
            });

          axios
            .get(`https://api.teleport.org/api/urban_areas/slug:rome/scores/`)
            .then((response) => {
              const defDescriptionData = response.data;

              const summary = _.get(defDescriptionData, "summary");
              defSummary.innerHTML = summary;
            })

            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    });
}

export default defaultCity;
