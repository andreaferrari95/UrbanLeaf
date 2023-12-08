import axios from "axios";

// Function to fetch air pollution and weather data for a city
async function getAirAndWeatherData(city) {
  const apiKey = "b37a3d1a-7dd2-4644-8a2f-3970bae2d424";
  // Replace with your IQair API key

  // Construct the API endpoint URL
  const apiUrl = `https://api.airvisual.com/v2/city?city=${encodeURIComponent(
    city
  )}&state=Latium&country=Italy&key=${apiKey}`;

  try {
    // Make an HTTP GET request to the API endpoint using Axios
    const response = await axios.get(apiUrl);
    const data = response.data;

    // Extract air pollution and weather data from the response
    const airQuality = data.data.current.pollution.aqius;
    const mainPollutant = data.data.current.pollution.mainus;

    // Extract weather data from the response
    const temperature = data.data.current.weather.tp;
    const pressure = data.data.current.weather.pr;
    const humidity = data.data.current.weather.hu;
    const windSpeed = data.data.current.weather.ws;
    const windDirection = data.data.current.weather.wd;
    const weatherIcon = data.data.current.weather.ic;

    // Update the HTML div with the data
    const pollutionContainer = document.getElementById("pollutionContainer");
    pollutionContainer.innerHTML = `
        <p>Air Quality Index (AQI) in ${city}: ${airQuality}</p>
        <p>The Main Pollutant is: ${mainPollutant}</p>`;

    // Update the HTML div with the data
    weatherContainer.innerHTML = `
      <p>Temperature in ${city}: ${temperature}°C</p>
      <p>Pressure: ${pressure} hPa</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
      <p>Wind Direction: ${windDirection}°</p>
      <img src="https://www.airvisual.com/images/${weatherIcon}.png" alt="Weather Icon">
    `;
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
}

export default getAirAndWeatherData;
