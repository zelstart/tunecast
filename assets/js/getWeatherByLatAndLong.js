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

// function getCityState(latitude, longitude) {
// const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=$4851bf8ba85c400f924d6c035c7be750`;
// fetch(apiUrl)
//   .then(response => response.json())
//   .then(data => {
//     const city = data.results[0].components.city;
//     const state = data.results[0].components.state_code;
//     console.log(`City: ${cityFromLL}, State: ${statefromLL}`);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
//   }
