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

  //Categories scores
  const defCityName = document.getElementById("category-city");
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
          const cityName = _.get(cityData, "name");
          defcity.innerHTML = fullName;
          defCityName.innerHTML = "CITY: " + cityName;

          axios
            .get(
              `https://api.airvisual.com/v2/city?city=Rome&state=Latium&country=Italy&key=${process.env.IQAIR_API_KEY}`
            )

            .then((response) => {
              const defWeatherData = response.data;

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
              const categories = _.get(defDescriptionData, "categories");
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
              const intervalDuration = Math.floor(
                animationDuration / roundedScores
              ); // Calculate interval duration based on animation duration and rounded scores

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
