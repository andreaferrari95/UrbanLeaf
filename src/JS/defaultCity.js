import axios from "axios";
import _, { head } from "lodash";

function defaultCity() {
  const defcity = document.getElementById("city");
  const defSummary = document.getElementById("city-description");
  const defTemp = document.getElementById("temperature");
  const defcityScore = document.getElementById("score");
  const defPressure = document.getElementById("air-pressure-data");
  const defHumidity = document.getElementById("humidity-data");
  const defWind = document.getElementById("wind-speed-data");
  const defWindDirection = document.getElementById("wind-direction-data");
  const defWeatherIcon = document.getElementById("weather-icon");
  const defAirQuality = document.getElementById("air-quality-data");
  const defPollutant = document.getElementById("pollutant-data");

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
          defcity.innerHTML = fullName;

          axios
            .get(
              `https://api.airvisual.com/v2/city?city=Rome&state=Latium&country=Italy&key=4fb35cd8-01d9-4068-a090-0634e06a0e4a`
            )

            .then((response) => {
              const defWeatherData = response.data;

              console.log(defWeatherData, "data");

              const temperature = _.get(
                defWeatherData,
                "data.current.weather.tp"
              );
              const pressure = _.get(defWeatherData, "data.current.weather.pr");
              const humidity = _.get(defWeatherData, "data.current.weather.hu");
              const windSpeed = _.get(
                defWeatherData,
                "data.current.weather.ws"
              );
              const windDirection = _.get(
                defWeatherData,
                "data.current.weather.wd"
              );
              const weatherIcon = _.get(
                defWeatherData,
                "data.current.weather.ic"
              );
              const airQuality = _.get(
                defWeatherData,
                "data.current.pollution.aqius"
              );
              const mainPollutant = _.get(
                defWeatherData,
                "data.current.pollution.mainus"
              );

              console.log(
                temperature,
                pressure,
                humidity,
                windSpeed,
                windDirection,
                weatherIcon,
                airQuality,
                mainPollutant
              );

              defTemp.innerHTML = temperature + "°C";
              defPressure.innerHTML = pressure + " hPa";
              defHumidity.innerHTML = humidity + "%";
              defWind.innerHTML = windSpeed + " m/s";
              defWindDirection.innerHTML = windDirection + "°";
              defWeatherIcon.src = `https://www.airvisual.com/images/${weatherIcon}.png`;
              defAirQuality.innerHTML = airQuality + " AQI";
              defPollutant.innerHTML = mainPollutant;
            });
          axios
            .get(`https://api.teleport.org/api/urban_areas/slug:rome/scores/`)
            .then((response) => {
              const defDescriptionData = response.data;

              const summary = _.get(defDescriptionData, "summary");
              const scores = _.get(defDescriptionData, "teleport_city_score");
              const roundedScores = Math.round(scores);
              defSummary.innerHTML = summary;
              defcityScore.innerHTML = roundedScores + "%";
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
