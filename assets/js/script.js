$(document).ready(function () {

    function getWeatherData(city, state) {
        let apiKey = 'fc83ec8cd64eb691a5994da1280e5c60';
        let weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
        let apiWeatherUrl = `${weatherUrl}${city}`;
  
        if (state) {
          apiWeatherUrl += `,${state},US`;
        }
  
        apiWeatherUrl += `&appid=${apiKey}&units=imperial`;

      fetch(apiWeatherUrl)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            console.error('Error fetching weather data:', response.status);
          }
        })
        .then((data)=> {
          let weatherDisplay = document.getElementById('weather-display');
          $("#weather-display").removeClass("hidden");
          weatherDisplay.innerHTML = `
          <p>City: ${data.name}</p>
          <p>Temperature: ${data.main.temp}</p>
          <p>Description: ${data.weather[0].description}</p>
          `;
        })
        .catch((error) => {
          console.error('Fetch error:', error);
        });
    }
    $('#getWeatherBtn').click(function (){
        let locationInputSplit = $('#location-input').val().toLowerCase().split(",");
        let city = locationInputSplit[0];
        console.log(locationInputSplit) // check to see if it logs
        if (city.trim() !== ''){
          getWeatherData(city)
        } 
        if (locationInputSplit[1]) {
          let state = locationInputSplit[1].trim();
          getWeatherData(city, state)
        }
      })

    $('#location-input').on('keydown', function (event) {
        if (event.keyCode === 13) {
            $('#getWeatherBtn').click();
        }
    })




})