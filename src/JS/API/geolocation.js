import axios from "axios";
import _ from "lodash";

const geolocationButton = document.querySelector(".location-button");
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
const defCityName = document.getElementById("category-city");

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function getLocationAndRequest() {
  getCurrentPosition()
    .then((position) => {
      const { latitude, longitude } = position.coords;
      return axios.get(
        `https://api.teleport.org/api/locations/${latitude},${longitude}/`
      );
    })
    .then((response) => {
      const geoloCityHref =
        response.data._embedded["location:nearest-cities"][0]._links[
          "location:nearest-city"
        ].href;
      return axios.get(geoloCityHref);
    })
    .then((response) => getCityDetails(response.data))
    .then((cityDetails) => getCityScores(cityDetails))
    .then((cityScores) => {
      updateCityInfo(cityScores);
      const { lat, lon } = cityScores;
      return getWeatherData(lat, lon);
    })
    .then((weatherData) => updateWeatherInfo(weatherData))
    .catch(handleError);
}

function getCityDetails(cityData) {
  const fullName = _.get(cityData, "full_name");
  const cityName = _.get(cityData, "name");

  defcity.innerHTML = fullName;
  defCityName.innerHTML = "CITY: " + cityName;

  const lat = _.get(cityData, "location.latlon.latitude");
  const lon = _.get(cityData, "location.latlon.longitude");
  const cityNameForCalling = cityName.toLowerCase();

  return {
    lat,
    lon,
    cityNameForCalling,
  };
}

async function getCityScores(cityDetails) {
  const url = `https://api.teleport.org/api/urban_areas/slug:${cityDetails.cityNameForCalling}/scores/`;
  const response = await axios.get(url);
  const descriptionData = response.data;
  const summary = _.get(descriptionData, "summary");
  const scores = _.get(descriptionData, "teleport_city_score");
  const categories = _.get(descriptionData, "categories");
  const roundedScores = Math.round(scores);

  defSummary.innerHTML = summary;
  updateScoreCircleAnimation(Math.round(scores));

  return {
    lat: cityDetails.lat,
    lon: cityDetails.lon,
    categories,
    roundedScores,
  };
}

function updateCityInfo(cityScores) {
  const idMapping = {
    housing: "housing",
    education: "education",
    economy: "economy",
    healthcare: "healthcare",
    safety: "safety",
    outdoors: "outdoors",
    startups: "startups",
    taxation: "taxation",
    "cost of living": "cost-of-living",
    "travel connectivity": "travel-connectivity",
    "environmental quality": "environmental-quality",
    "internet access": "internet-access",
    "business freedom": "business-freedom",
    "leisure & culture": "leisure-and-culture",
  };

  cityScores.categories.forEach((item) => {
    const categoryId = idMapping[item.name.toLowerCase()];
    const categoryElement = document.getElementById(categoryId);

    if (categoryElement) {
      categoryElement.textContent = `${item.score_out_of_10.toFixed(1)}/10`;
    } else {
      console.warn(
        `Element with id "${categoryId}" not found in HTML. Skipping.`
      );
    }
  });

  const idMappingBar = {
    housing: "housing-bar",
    education: "education-bar",
    economy: "economy-bar",
    healthcare: "healthcare-bar",
    safety: "safety-bar",
    outdoors: "outdoors-bar",
    startups: "startups-bar",
    taxation: "taxation-bar",
    "cost of living": "cost-of-living-bar",
    "travel connectivity": "travel-connectivity-bar",
    "environmental quality": "environmental-quality-bar",
    "internet access": "internet-access-bar",
    "business freedom": "business-freedom-bar",
    "leisure & culture": "leisure-and-culture-bar",
  };

  categories.forEach((item) => {
    const categoryClass = idMappingBar[item.name.toLowerCase()];

    if (categoryClass) {
      const categoryElement = document.querySelector(`.${categoryClass}`);
      const categoryScore = Math.floor(item.score_out_of_10 * 10);

      if (categoryElement) {
        categoryElement.style.width = `${categoryScore}%`;

        const keyframeName = categoryClass;
        const keyframeDuration = categoryScore / 25;
        const keyframesStyle = document.styleSheets[0];
        let keyframeExists = false;

        for (let i = 0; i < keyframesStyle.cssRules.length; i++) {
          if (keyframesStyle.cssRules[i].name === keyframeName) {
            keyframeExists = true;
            break;
          }
        }

        if (!keyframeExists) {
          keyframesStyle.insertRule(
            `@keyframes ${keyframeName} {
              0% {
                width: 0%;
              }
              100% {
                width: ${categoryScore}%;
              }
            }`,
            keyframesStyle.cssRules.length
          );
        }

        categoryElement.style.animation = `${keyframeName} ${keyframeDuration}s`;
      } else {
        console.warn(
          `Element with class "${categoryClass}" not found in HTML. Skipping.`
        );
      }
    }
  });

  return Promise.resolve({ lat: cityScores.lat, lon: cityScores.lon });
}

async function getWeatherData(latitude, longitude) {
  const url = `http://api.airvisual.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${process.env.IQAIR_API_KEY}`;
  const response = await axios.get(url);
  return response.data;
}

function updateWeatherInfo(weatherData) {
  const {
    tp: temperature,
    pr: pressure,
    hu: humidity,
    ws: windSpeed,
    wd: windDirection,
    ic: weatherIcon,
    aqius: airQuality,
    mainus: mainPollutant,
  } = _.get(weatherData, "data.current.weather");

  defTemp.innerHTML = `${temperature}°C`;
  defPressure.innerHTML = `${pressure} hPa`;
  defHumidity.innerHTML = `${humidity}%`;
  defWind.innerHTML = `${windSpeed} m/s`;
  defWindDirection.innerHTML = `${windDirection}°`;
  defWeatherIcon.src = `https://www.airvisual.com/images/${weatherIcon}.png`;
  defAirQuality.innerHTML = `${airQuality} AQI`;
  defPollutant.innerHTML = mainPollutant;

  return Promise.resolve();
}

function handleError(error) {
  if (error.response && error.response.status === 404) {
    showErrorMessage(
      "City not found. Please try searching for a different city."
    );
  } else {
    console.error("Error:", error);
  }
}

function showErrorMessage(message) {
  const errorMessageContainer = document.createElement("div");
  errorMessageContainer.className = "error-message";
  errorMessageContainer.innerHTML = `
    <p>${message}</p>
    <button id="okButton">OK</button>
  `;

  errorMessageContainer.style.backgroundColor = "#ff6666";
  errorMessageContainer.style.color = "#ffffff";
  errorMessageContainer.style.padding = "10px";
  errorMessageContainer.style.borderRadius = "5px";
  errorMessageContainer.style.position = "fixed";
  errorMessageContainer.style.top = "3%";
  errorMessageContainer.style.left = "50%";
  errorMessageContainer.style.transform = "translateX(-50%)";
  errorMessageContainer.style.fontSize = "1.5rem";

  document.body.appendChild(errorMessageContainer);

  const okButton = document.getElementById("okButton");

  if (okButton) {
    okButton.style.padding = "8px 16px";
    okButton.style.fontWeight = "bold";
    okButton.style.marginTop = "10px";
    okButton.style.fontSize = "2rem";

    okButton.addEventListener("click", () => {
      errorMessageContainer.remove();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      errorMessageContainer.remove();
    }
  });
}

function updateScoreCircleAnimation(roundedScores) {
  const svgCircle = document.querySelector("circle");
  const svgCircleRadius = 85;
  const svgCircleCircumference = 2 * Math.PI * svgCircleRadius;
  const percentage = (roundedScores / 100) * svgCircleCircumference;
  const strokeDashoffset = svgCircleCircumference - percentage;
  const animationDuration = 2000;

  svgCircle.style.setProperty("--dash-offset", strokeDashoffset);
  svgCircle.style.animationDuration = `${animationDuration}ms`;

  let counter = 0;
  const intervalDuration = animationDuration / roundedScores;

  const intervalId = setInterval(() => {
    if (counter >= roundedScores) {
      clearInterval(intervalId);
    } else {
      counter += 1;
      defcityScore.innerHTML = `${counter}%`;
    }
  }, intervalDuration);
}

geolocationButton.addEventListener("click", getLocationAndRequest);
