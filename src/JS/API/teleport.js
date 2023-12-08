import axios from "axios";

function teleportAPI() {
  axios
    .get("https://api.teleport.org/api/")
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => console.log(error));
}

export default teleportAPI;
// Searching for Cities by Name

// Basic information about a city

// Life quality Data for Urban Area
