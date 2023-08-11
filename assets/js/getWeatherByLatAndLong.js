    // grab lat and lon from geolocator api, construct a url and use it to grab weather data
    function getWeatherByLatAndLong(latitude, longitude) {
        let apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=7a0c14487898bae146a1b3a3863031d0&units=imperial`

        return fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            let weatherData = {
                temp: data.list[0].main.temp,
                windSpeed: data.list[0].wind.speed,
                weatherDesc: data.list[0].weather[0].description
            }
            console.log(weatherData);
            return weatherData;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            return null;
        });
}