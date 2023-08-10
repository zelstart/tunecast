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
        weatherDisplay.classList.remove('hidden');
        document.getElementById('error-message').parentElement.classList.add('hidden');
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        let errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Please enter a valid location';
        errorMessage.parentElement.classList.remove('hidden');
        document.getElementById('weather-display').classList.add('hidden');
      });
  }
  $('#getWeatherBtn').click(function () {
    let locationInput = $('#location-input').val().toLowerCase().trim();
    let locationInputSplit = locationInput.split(",");
    let city = locationInputSplit[0];
    let state = locationInputSplit[1] ? locationInputSplit[1].trim() : null;
  
    let errorMessage = document.getElementById('error-message');
  
    if (city === '') {
      errorMessage.textContent = 'Please enter a valid location';
      errorMessage.parentElement.classList.remove('hidden');
    } else {
      errorMessage.parentElement.classList.add('hidden');
  
      if (state) {
        getWeatherData(city, state);
      } else {
        getWeatherData(city);
      }
    }
  });

  $('#location-input').on('keydown', function (event) {
      if (event.keyCode === 13) {
          $('#getWeatherBtn').click();
    
      }
  })




})