import axios from "axios";
import _, { head } from "lodash";
import "../assets/styles/styles.scss";
import logo from "../assets/img/UrbanLeaf-Logo.png";
import icon from "../assets/img/planet-earth.ico";
import city from "./API/teleport.js";
import getAirAndWeatherData from "./API/iqair.js";

const logoImg = document.getElementById("logo");
logoImg.src = logo;

const iconImg = document.getElementById("icon");
iconImg.href = icon;

const cityToSearch = "Rome";
getAirAndWeatherData(cityToSearch);
