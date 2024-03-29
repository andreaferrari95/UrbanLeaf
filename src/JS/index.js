import axios from "axios";
import _, { defer, head } from "lodash";
import "../assets/styles/main.scss";
import logo from "../assets/img/UrbanLeaf-Logo.png";
import icon from "../assets/img/planet-earth.ico";
import pollutionSvg from "../assets/img/pollutant.png";
import airQualitySvg from "../assets/img/air-quality.png";
import humiditySvg from "../assets/img/humidity.png";
import windSvg from "../assets/img/wind.png";
import pressureSvg from "../assets/img/air-pressure.png";
import windDirectionSvg from "../assets/img/wind-direction.png";

//logo and icons

const elements = [
  { id: "logo", src: logo },
  { id: "humidity-svg", src: humiditySvg },
  { id: "pollutant-svg", src: pollutionSvg },
  { id: "air-quality-svg", src: airQualitySvg },
  { id: "wind-speed-svg", src: windSvg },
  { id: "air-pressure-svg", src: pressureSvg },
  { id: "wind-direction-svg", src: windDirectionSvg },
];

elements.forEach((element) => {
  const img = document.getElementById(element.id);
  img.src = element.src;
});

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

const expandResultButton = document.querySelector(".expand-result-button");
const cityDetails = document.querySelector(".category-main");

expandResultButton.addEventListener("click", () => {
  cityDetails.style.display = "grid";
  cityDetails.scrollIntoView({ behavior: "smooth" });
});
