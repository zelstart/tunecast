
// Code snippet taken from https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API

const geoLocateButton = document.querySelector("#geo-locate-button");

function getLatAndLong() {
  //Returns a promise that resolves with object containing lat and long values
  return new Promise((resolve, reject) => {
    function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      resolve({ latitude, longitude }); 
    }

    function error() {
      reject("Unable to retrieve your location");
    }

    if (!navigator.geolocation) {
      reject("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  });
}

/*
function getWeather() {
    const temp = 80; // Fahrenheit
    const weatherDesc = "rainy";
    const windSpeed = 18; // mph
    
    return { temp, weatherDesc, windSpeed };
}*/


geoLocateButton.addEventListener("click", async () => {
  try {
    const coordinates = await getLatAndLong(); // Needed to await result of promise
    console.log("Latitude:", coordinates.latitude, "Longitude:", coordinates.longitude); // Delete
    // const weatherData = getWeatherByLatAndLong(coordinates.latitude, coordinates.longitude);
    // const searchTerm = getSearchTerm(weatherData.temp, weatherData.weatherDesc, weatherData.windSpeed);
    // const videoId = searchVideo(searchTerm);
    // embedVideo(videoId);
  } catch (error) {
    console.error(error);
  }
});
