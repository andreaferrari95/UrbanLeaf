import axios from "axios";
import _, { head } from "lodash";

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

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

searchButton.addEventListener("click", searchCity);
searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    searchCity();
  }
});

function searchCity() {
  const city = searchInput.value;

  getCity(city)
    .then(({ lat, lon, cityNameForCalling }) => {
      return getCityScores({ lat, lon, cityNameForCalling });
    })
    .then(({ lat, lon, categories }) => {
      return updateCityInfo({ lat, lon, categories });
    })
    .then(({ lat, lon }) => {
      return getWeatherData({ lat, lon });
    })
    .then(updateWeatherInfo)
    .catch(handleError)
    .finally(() => {
      searchInput.value = "";
    });
}

function getCity(city) {
  return axios
    .get(`https://api.teleport.org/api/cities/?search=${city}`)
    .then((response) => {
      const data = response.data;
      const href = _.get(
        data,
        '_embedded["city:search-results"][0]._links["city:item"].href'
      );
      return axios.get(href);
    })
    .then((response) => {
      const cityData = response.data;
      const lat = _.get(cityData, "location.latlon.latitude");
      const lon = _.get(cityData, "location.latlon.longitude");
      const fullName = _.get(cityData, "full_name");
      const cityName = _.get(cityData, "name");
      const cityNameForCalling = cityName.toLowerCase();

      // Update UI with location information
      defcity.innerHTML = fullName;
      defCityName.innerHTML = "CITY: " + cityName;
      console.log(lat, lon);
      return { lat, lon, cityNameForCalling };
    });
}

function getCityScores({ lat, lon, cityNameForCalling }) {
  return axios
    .get(
      `https://api.teleport.org/api/urban_areas/slug:${cityNameForCalling}/scores/`
    )
    .then((response) => {
      const descriptionData = response.data;
      const summary = _.get(descriptionData, "summary");
      const scores = _.get(descriptionData, "teleport_city_score");
      const categories = _.get(descriptionData, "categories");

      // Update UI with city scores information
      defSummary.innerHTML = summary;
      updateScoreCircleAnimation(Math.round(scores));

      return { lat, lon, categories };
    });
}

function updateCityInfo({ categories, lat, lon }) {
  // Update UI with city scores information
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

  categories.forEach((item) => {
    const categoryId = idMapping[item.name.toLowerCase()];

    if (categoryId) {
      const categoryElement = document.getElementById(categoryId);

      if (categoryElement) {
        categoryElement.textContent = item.score_out_of_10.toFixed(1) + "/10";
      } else {
        console.warn(
          `Element with id "${categoryId}" not found in HTML. Skipping.`
        );
      }
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
      const categoryScore = Math.floor(item.score_out_of_10 * 10); // Multiply by 10

      if (categoryElement) {
        categoryElement.style.width = `${categoryScore}%`; // Update bar width

        // Update keyframes dynamically
        const keyframeName = categoryClass;
        const keyframeDuration = categoryScore / 25; // Adjust duration based on the new score
        const keyframesStyle = document.styleSheets[0];
        let keyframeExists = false;

        // Check if the keyframes rule already exists
        for (let i = 0; i < keyframesStyle.cssRules.length; i++) {
          if (keyframesStyle.cssRules[i].name === keyframeName) {
            keyframeExists = true;
            break;
          }
        }

        // If not, add it
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

        // Apply the updated keyframe duration to the animation
        categoryElement.style.animation = `${keyframeName} ${keyframeDuration}s`;
      } else {
        console.warn(
          `Element with class "${categoryClass}" not found in HTML. Skipping.`
        );
      }
    }
  });

  return Promise.resolve({ lat, lon });
}

function getWeatherData({ lat, lon }) {
  return axios
    .get(
      `http://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${process.env.IQAIR_API_KEY}`
    )
    .then((response) => response.data);
}

function updateWeatherInfo(weatherData) {
  // Update UI with weather information
  console.log(weatherData);

  const temperature = _.get(weatherData, "data.current.weather.tp");
  const pressure = _.get(weatherData, "data.current.weather.pr");
  const humidity = _.get(weatherData, "data.current.weather.hu");
  const windSpeed = _.get(weatherData, "data.current.weather.ws");
  const windDirection = _.get(weatherData, "data.current.weather.wd");
  const weatherIcon = _.get(weatherData, "data.current.weather.ic");
  const airQuality = _.get(weatherData, "data.current.pollution.aqius");
  const mainPollutant = _.get(weatherData, "data.current.pollution.mainus");

  defTemp.innerHTML = temperature + "°C";
  defPressure.innerHTML = pressure + " hPa";
  defHumidity.innerHTML = humidity + "%";
  defWind.innerHTML = windSpeed + " m/s";
  defWindDirection.innerHTML = windDirection + "°";
  defWeatherIcon.src = `https://www.airvisual.com/images/${weatherIcon}.png`;
  defAirQuality.innerHTML = airQuality + " AQI";
  defPollutant.innerHTML = mainPollutant;

  return Promise.resolve(); // Resolving with no data as it's the final step
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
  // Display error message to the user
  const errorMessageContainer = document.createElement("div");
  errorMessageContainer.className = "error-message";
  errorMessageContainer.innerHTML = `
      <p>${message}</p>
      <button id="okButton">OK</button>
    `;

  // Customize your error message style with CSS
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
    okButton.style.padding = "8px 16px"; // Add padding to make the button bigger
    okButton.style.fontWeight = "bold"; // Make the button text bold
    okButton.style.marginTop = "10px";
    okButton.style.fontSize = "2rem"; // Add margin to the top for more space

    // Add event listener for the OK button
    okButton.addEventListener("click", () => {
      errorMessageContainer.remove();
    });
  }

  // Remove the error message when Enter key is pressed
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      errorMessageContainer.remove();
    }
  });
}

function updateScoreCircleAnimation(roundedScores) {
  // Update UI with the animated score circle
  const svgCircle = document.querySelector("circle");
  const svgCircleRadius = 85;
  const svgCircleCircumference = 2 * Math.PI * svgCircleRadius;
  const percentage = (roundedScores / 100) * svgCircleCircumference;
  const strokeDashoffset = svgCircleCircumference - percentage;
  const animationDuration = 2000; // Specify the animation duration in milliseconds

  svgCircle.style.setProperty("--dash-offset", strokeDashoffset);
  svgCircle.style.animationDuration = `${animationDuration}ms`;

  let counter = 0;
  const intervalDuration = animationDuration / roundedScores; // Calculate interval duration based on animation duration and rounded scores

  const intervalId = setInterval(() => {
    if (counter >= roundedScores) {
      clearInterval(intervalId);
    } else {
      counter += 1;
      defcityScore.innerHTML = `${counter}%`;
    }
  }, intervalDuration);
}
