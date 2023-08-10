$(document).ready(function () {

    function getWeatherData(city) {
      let apiKey = 'fc83ec8cd64eb691a5994da1280e5c60';
      let weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
      let apiWeatherUrl = `${weatherUrl}${city}&appid=${apiKey}&units=imperial`;
      

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
          let errorMessage = document.getElementById('error-message');
          errorMessage.textContent = 'Please enter a valid location';
        });
    }
    $('#getWeatherBtn').click(function (){
      let locationInput = $('#location-input').val();
      if (locationInput.trim() !== ''){
        getWeatherData(locationInput)
      }
    })

    $('#location-input').on('keydown', function (event) {
        if (event.keyCode === 13) {
            $('#getWeatherBtn').click();
        }else {
          let errorMessage = document.getElementById('error-message');
          errorMessage.textContent = 'Please enter a location';
        }
    })




})