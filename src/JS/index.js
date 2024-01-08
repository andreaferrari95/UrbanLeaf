import axios from "axios";
import _, { defer, head } from "lodash";
import "../assets/styles/main.scss";
import logo from "../assets/img/UrbanLeaf-Logo.png";
import icon from "../assets/img/planet-earth.ico";
import defaultCity from "./defaultCity";

//logo and icon

const logoImg = document.getElementById("logo");
logoImg.src = logo;

const iconImg = document.getElementById("icon");
iconImg.href = icon;

//date and time function

let hrs = document.getElementById("hrs");
let min = document.getElementById("min");
let sec = document.getElementById("sec");
let day = document.getElementById("day");
let date = document.getElementById("date");
let month = document.getElementById("month");
let year = document.getElementById("year");

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

setInterval(() => {
  let currentTime = new Date();

  hrs.innerHTML =
    (currentTime.getHours() < 10 ? "0" : "") + currentTime.getHours();
  min.innerHTML =
    (currentTime.getMinutes() < 10 ? "0" : "") + currentTime.getMinutes();
  sec.innerHTML =
    (currentTime.getSeconds() < 10 ? "0" : "") + currentTime.getSeconds();

  day.innerHTML = daysOfWeek[currentTime.getDay()];

  date.innerHTML =
    (currentTime.getDate() < 10 ? "0" : "") + currentTime.getDate();

  month.innerHTML =
    (currentTime.getMonth() + 1 < 10 ? "0" : "") + (currentTime.getMonth() + 1);
  year.innerHTML = currentTime.getFullYear();
}, 1000);

defaultCity();

//geolocation function
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

console.log(process.env.GOOGLE_PLACES_API);
console.log(process.env.TELEPORT_API_URL);
//import city from "./API/teleport.js";
//import getAirAndWeatherData from "./API/iqair.js";

//const cityToSearch = "Rome";
//getAirAndWeatherData(cityToSearch);
