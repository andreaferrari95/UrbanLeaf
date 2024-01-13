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
                  const categoryElement = document.querySelector(
                    `.${categoryClass}`
                  );
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
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    });
}

export default defaultCity;
