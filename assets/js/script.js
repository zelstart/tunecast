$(document).ready(function () {

    function getWeatherData(city) {
      let apiKey = 'fc83ec8cd64eb691a5994da1280e5c60';
      let weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
      let apiWeatherUrl = `${weatherUrl}${city}&appid=${apiKey}`;
      

      fetch(apiWeatherUrl)
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              console.log(data);
            });
          } else {
            console.error('Error fetching weather data:', response.status);
          }
        })
        .then((data)=> {
          let weatherDisplay = document.getElementById('weather-display');
          weatherDisplay.innerHTML = `
          <p>City: ${data.name}</p>
          <p>Temperature: ${data.main.temp}</p>
          <p>Description: ${data.weather[0].descritption}</p>
          `;
        })
        .catch((error) => {
          console.error('Fetch error:', error);
        });
    }
    $('#getWeatherBtn').click(function (){
      let locationInput = $('#location-input').val();
      if (locationInput.trim() !== ''){
        getWeatherData(locationInput)
      }
    })
})