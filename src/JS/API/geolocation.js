import axios from "axios";
import _, { head } from "lodash";

const geolocationButton = document.querySelector(".location-button");

function getLocationAndRequest() {
  navigator.geolocation.getCurrentPosition(function (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Call the other API with the latitude and longitude
    // You can use Axios to make the API request
    axios
      .get(`https://api.teleport.org/api/locations/${latitude},${longitude}/`)
      .then(function (response) {
        // Handle the response
        console.log(response.data);
      })
      .catch(function (error) {
        // Handle the error
        console.error(error);
      });
  });
}

geolocationButton.addEventListener("click", getLocationAndRequest);
