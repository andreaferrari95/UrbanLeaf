import axios from "axios";
import _, { head } from "lodash";

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
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error)
    );
  });
}

function getLocationAndRequest() {
  let latitude, longitude, cityName;
  getCurrentPosition()
    .then((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      return axios.get(
        `https://api.teleport.org/api/locations/${latitude},${longitude}/`
      );
    })
    .then((response) => {
      const data = response.data;
      const geoloCityHref = _.get(
        data,
        '_embedded["location:nearest-cities"][0]._links["location:nearest-city"].href'
      );

      return axios.get(geoloCityHref);
    })
    .then((response) => {
      const cityData = response.data;
      const fullName = _.get(cityData, "full_name");
      const cityName = _.get(cityData, "name");
      defcity.innerHTML = fullName;
      defCityName.innerHTML = "CITY: " + cityName;

      return axios.get(
        `https://api.teleport.org/api/urban_areas/slug:${cityName}/scores/`
      );
    })
    .then((response) => {
      const DescriptionData = response.data;

      const summary = _.get(DescriptionData, "summary");
      const scores = _.get(DescriptionData, "teleport_city_score");
      const categories = _.get(DescriptionData, "categories");
      const roundedScores = Math.round(scores);
      defSummary.innerHTML = summary;

      const svgCircle = document.querySelector("circle");
      const svgCircleRadius = 85;
      const svgCircleCircumference = 2 * Math.PI * svgCircleRadius;
      const percentage = (roundedScores / 100) * svgCircleCircumference;
      const strokeDashoffset = svgCircleCircumference - percentage;
      const animationDuration = 2000; // Specify the animation duration in milliseconds

      svgCircle.style.setProperty("--dash-offset", strokeDashoffset);
      svgCircle.style.animationDuration = `${animationDuration}ms`;

      let counter = 0;
      const intervalDuration = Math.floor(animationDuration / roundedScores); // Calculate interval duration based on animation duration and rounded scores

      const intervalId = setInterval(() => {
        if (counter >= roundedScores) {
          clearInterval(intervalId);
        } else {
          counter += 1;
          defcityScore.innerHTML = `${counter}%`;
        }
      }, intervalDuration);

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
            categoryElement.textContent =
              item.score_out_of_10.toFixed(1) + "/10";
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
    })
    .catch((error) => {
      // Handle the error
      if (error.response && error.response.status === 404) {
        // Display a message for city not found
        showErrorMessage(
          "City not found. Please try searching for a different city."
        );
      } else {
        // Handle other errors (you might want to log or display a generic error message)
        console.error(error);
      }
    });

  function showErrorMessage(message) {
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

  return axios
    .get(
      `http://api.airvisual.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${process.env.IQAIR_API_KEY}`
    )

    .then((response) => {
      const weatherData = response.data;
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
    })

    .catch((error) => {
      // Handle the error
      console.error(error);
    });
}

geolocationButton.addEventListener("click", getLocationAndRequest);
