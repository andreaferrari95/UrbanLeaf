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

//Categories scores

const defCategoryCity = document.getElementById("category-city");
const defHousing = document.getElementById("housing");
const defHousingBar = document.querySelector(".housing-bar");
const defSafety = document.getElementById("safety");
const defSafetyBar = document.querySelector(".safety-bar");
const defHealthCare = document.getElementById("healthcare");
const defHealthCareBar = document.querySelector(".healthcare-bar");
const defEnvironmentalQuality = document.getElementById(
  "environmental-quality"
);
const defEnvironmentalQualityBar = document.querySelector(
  ".enviromental-quality-bar"
);
const defTaxation = document.getElementById("taxation");
const defTaxationBar = document.querySelector(".taxation-bar");
const defLeisureAndCulture = document.getElementById("leisure-and-culture");
const defLeisureAndCultureBar = document.querySelector(
  ".leisure-and-culture-bar"
);
const defStartups = document.getElementById("startups");
const defStartupsBar = document.querySelector(".startups-bar");

const defCityostOfLiving = document.getElementById("cost-of-living");
const defCostOfLivingBar = document.querySelector(".cost-of-living-bar");
const defTravelConnectivity = document.getElementById("travel-connectivity");
const defTravelConnectivityBar = document.querySelector(
  ".travel-connectivity-bar"
);
const defEducation = document.getElementById("education");
const defEducationBar = document.querySelector(".education-bar");
const defEconomy = document.getElementById("economy");
const defEconomyBar = document.querySelector(".economy-bar");
const defInternetAccess = document.getElementById("internet-access");
const defInternetAccessBar = document.querySelector(".internet-access-bar");
const defOutdoors = document.getElementById("outdoors");
const defOutdoorsBar = document.querySelector(".outdoors-bar");
const defBusinessFreedom = document.getElementById("business-freedom");
const defBusinessFreedomBar = document.querySelector(".business-freedom-bar");
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
      console.log(cityName);

      return axios.get(
        `https://api.teleport.org/api/urban_areas/slug:berlin/scores/`
        // `https://api.teleport.org/api/urban_areas/slug:${cityName}/scores/`
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

      console.log(categories);

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
    });

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
