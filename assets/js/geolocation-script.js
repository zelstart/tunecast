
// Geolocation code snippet modified from https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API

$(document).ready(function () {

  const geoLocateButton = document.querySelector("#geolocate-btn");

  const videoContainer = $('#video-container');
  const urlContainer = $('#url-container');

  var glSearchTerm = "";
  var glWeatherData;

  // Load the YouTube Data API client library
  gapi.load('client', function () {
    console.log('YouTube Data API loaded.');
  });

  //Gets the latitude and longitude of the user
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

  //Gets the weather data from the weather api using the latitude and longitude
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

        // Update the weather display with the fetched weather data
        updateWeatherDisplay(data);

        return weatherData;
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        return null;
      });
  }

  //Updates the weather display
  //NEEDS TO BE DEPRECATED FROM THE GETWEATHERBYCITYANDSTATE FUNCTION
  function updateWeatherDisplay(weatherData) {
    let weatherDisplay = document.getElementById('weather-display');
    $("#weather-display").removeClass("hidden");
    weatherDisplay.innerHTML = `
      <p><span class="weather-label">City:</span> <span class="weather-value">${weatherData.city.name}</span></p>
      <p><span class="weather-label">Temperature:</span> <span class="weather-value">${weatherData.list[0].main.temp}</span></p>
      <p><span class="weather-label">Description:</span> <span class="weather-value">${weatherData.list[0].weather[0].description}</span></p>
      <p><span class="weather-label">Wind Speed:</span> <span class="weather-value">${weatherData.list[0].wind.speed} mph</span></p>
      <p><span class="weather-label">Humidity:</span> <span class="weather-value">${weatherData.list[0].main.humidity} %</span></p>
  `;

    let icon = weatherData.list[0].weather[0].icon;
    let iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;
    let weatherIcon = document.createElement('img');
    weatherIcon.src = iconUrl;
    weatherDisplay.appendChild(weatherIcon);

    weatherDisplay.classList.remove('hidden');
    document.getElementById('error-message').parentElement.classList.add('hidden');
  }


  // Function to search for videos based on the provided searchTerm
  function searchVideo(searchTerm) {
    const apiKey = 'AIzaSyAF_kOL8I7oy03kws7RLQcXyuo1DpkOfYM';
    //const description = descriptionInput.val();
    const maxResults = 1; // Number of results to fetch

    // Use the API to search for videos by searchTerm
    gapi.client.init({
      'apiKey': apiKey,
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
    }).then(function () {
      return gapi.client.youtube.search.list({
        q: searchTerm,
        part: 'snippet',
        type: 'video',
        maxResults: maxResults
      });
    }).then(function (response) {
      // Handle the search results
      const items = response.result.items;
      if (items.length > 0) {
        for (const item of items) {
          const videoId = item.id.videoId;
          const videoLink = `https://www.youtube.com/watch?v=${videoId}`;

          embedVideo(videoId);
          saveVideos(videoId);

          urlContainer.attr('href', videoLink);
          urlContainer.text(videoLink);

          //return videoId;
        }
      } else {
        console.log('No videos found with the given description.');
      }
    }).catch(function (error) {
      console.error('Error fetching videos:', error);
    });
  };

  //Gets the search term by using the temperature and the windspeed as parameters
  //
  // FUTURE DEV: Create a paramater for weatherDesc and have that effect the searchTerm
  function getSearchTerm(temp, windSpeed) {
    const temperatureWords = {
      hot: ["scorching", "blazing", "sizzling", "hot", "sweaty", "summer", "sun", "party"],
      warm: ["spring", "comfy", "warm", "crisp"],
      cool: ["fall", "chilly", "refreshing", "crisp", "dew", "sweater"],
      cold: ["winter", "freezing", "frigid", "icy", "snow"]
    };

    const windSpeedWords = {
      slow: ["calm", "tranquil", "gentle", "chill", "slow", "beats", "lo-fi"],
      fast: ["breezy", "upbeat", "windy", "dance", "edm", "fast"]
    };

    const ytGenre = ["vevo", "song", "hip-hop", "rock and roll" ,"blues", "rap", "lo-fi beats"];

    let temperatureCondition;
    if (parseFloat(temp) > 90.0) {
      temperatureCondition = "hot";
    } else if (parseFloat(temp) > 70.0) {
      temperatureCondition = "warm";
    } else if (parseFloat(temp) > 50.0) {
      temperatureCondition = "cool";
    } else {
      temperatureCondition = "cold";
    }

    let windSpeedCondition;
    if (windSpeed > 5.0) {
      windSpeedCondition = "fast";
    } else {
      windSpeedCondition = "slow";
    }

    const randomMusicIdentifier = ytGenre[Math.floor(Math.random() * ytGenre.length)];
    const randomTemperatureWord = temperatureWords[temperatureCondition][Math.floor(Math.random() * temperatureWords[temperatureCondition].length)];
    const randomWindSpeedWord = windSpeedWords[windSpeedCondition][Math.floor(Math.random() * windSpeedWords[windSpeedCondition].length)];

    let searchTerm = `${randomMusicIdentifier} ${randomTemperatureWord} ${randomWindSpeedWord}`;

    glSearchTerm = searchTerm;

    $('#yt-desc').html("We've found some music to fit the weather based on these keywords: " + "<br><br>" + randomTemperatureWord + "<br>" + randomWindSpeedWord + "<br><br>" + "Happy listening!!");
    return searchTerm;
  }

  //Embeds the video by using the videoId provided by the searchVideo function
  function embedVideo(videoId) {
    // Create a new <div> element for the player
    const playerDiv = $('<div></div>').addClass('youtube-player');

    // Append the player div to the videoContainer
    videoContainer.empty().append(playerDiv);


    // Create a new YouTube player in the playerDiv
    const player = new YT.Player(playerDiv[0], {
      videoId: videoId,
      width: 560,
      height: 315,
      playerVars: {
        // Other params
      },
      events: {
        'onReady': onPlayerReady
      }
    });


    function onPlayerReady(event) {
      // Get video title from the player
      const videoTitle = player.getVideoData().title;

      console.log(videoTitle);

      $("#content").removeClass("hidden");

      // Populate ytTitle with video title and description
      $('#yt-title').text(videoTitle);

    }
  }

  // open/close dropdown menu
  $('#choice-dropdown').click(function () {
    let screenWidth = window.innerWidth;
    $('#choice-dropdown').toggleClass("is-active");
    if (screenWidth < 600) { // if viewing on mobile screens, will make the dropdown menu go up
      $('#choice-dropdown').addClass("is-up")
    }
  });

  // click on dropdown menu item will save the user's choice as "searchTerms"
  $('#dropdown-menu').on('click', '.dropdown-item', function (event) {
    let searchTerms = $(event.target).text().trim();
    console.log(glSearchTerm + " "  + searchTerms);
    searchVideo(glSearchTerm + " "  + searchTerms);
  });


  //Applies the click event to the geolocate button and calls all the required functions
  geoLocateButton.addEventListener("click", async () => {
    try {
      //Gets coordinates
      const coordinates = await getLatAndLong(); // Needed to await result of promise
      console.log("Latitude:", coordinates.latitude, "Longitude:", coordinates.longitude); // Delete

      //Gets the weather by the Lat and Long and applies it to the weatherData object
      const weatherData = await getWeatherByLatAndLong(coordinates.latitude, coordinates.longitude);
      glWeatherData = weatherData;
      console.log(weatherData);

      //Gets the search term depending on the temperature and the windspeed
      const searchTerm = getSearchTerm(weatherData.temp, weatherData.windSpeed);
      console.log(searchTerm);

      //Gets the video Id by using the search term
      //THIS CALLS embedVideo IN THE FUNCTION IDK WHY IT WON'T WORK OUTSIDE
      searchVideo(searchTerm);

    } catch (error) {
      console.error(error);
    }
  });


  let videoHistory = JSON.parse(localStorage.getItem('videoHistory')) || [];
  let currentVideoIndex = parseInt(localStorage.getItem('currentVideoIndex')) || -1; //sets the value of currentVideoIndex to use for moving forward/backwards through the array


  function saveCurrentVideoIndex() {
    localStorage.setItem('currentVideoIndex', currentVideoIndex.toString());
  }

  function saveVideos(videoId) { // not sure which one of these i need for the embedVideo function.
    videoHistory.unshift(videoId); // Add new item to the front of the array
    if (videoHistory.length > 9) {
      videoHistory.pop(); // Remove the oldest video if there are more than 10
    }
    localStorage.setItem('videoHistory', JSON.stringify(videoHistory)); // Store the updated history in localStorage  
    console.log('VIDEO HISTORY: ', videoHistory);
  }

  $('#prev').click(function () { // on prev button click...
    if (currentVideoIndex < videoHistory.length - 1) { // ...if index is greater than 0...
      currentVideoIndex++; // ... increase it by 1...
      embedVideo(videoHistory[currentVideoIndex]); //... embedVideo using the videoHistory's data, and currentVideoIndex to get the previous video
      saveCurrentVideoIndex();
    }
  });

  $('#next').click(function () { 
    if (currentVideoIndex > 0) { 
      currentVideoIndex--; 
      embedVideo(videoHistory[currentVideoIndex]); 
      console.log(currentVideoIndex);
      saveCurrentVideoIndex();
    }else{
      glSearchTerm = getSearchTerm(glWeatherData.temp, glWeatherData.windSpeed);
      searchVideo(glSearchTerm);
      console.log(glSearchTerm);
    }
  });


  $('#clear-history').click(function () {
    localStorage.removeItem('videoHistory'); // Clear the video history from localStorage
    videoHistory = []; // Clear the videoHistory array in memory
    currentVideoIndex = -1; // Reset currentVideoIndex
  })

  /*
  function getWeatherByCityAndState(city, state) {
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
      <p><span class="weather-label">City:</span> <span class="weather-value">${data.name}</span></p>
      <p><span class="weather-label">Temperature:</span> <span class="weather-value">${data.main.temp}°F</span></p>
      <p><span class="weather-label">Feels Like:</span> <span class="weather-value">${data.main.feels_like}°F</span></p>
      <p><span class="weather-label">Description:</span> <span class="weather-value"> ${data.weather[0].description}</span></p>
      <p><span class="weather-label">Wind Speed:</span> <span class="weather-value">${data.wind.speed} mph</span></p>
      <p><span class="weather-label">Humidity:</span> <span class="weather-value">${data.main.humidity} %</p>
      `;
   
      let weatherData = {
        temp: data.main.temp,
        windSpeed: data.wind.speed,
        weatherDesc: $(data.weather[0].description)
      }

     
     glWeatherData = weatherData;

      let icon = data.weather[0].icon;
      let iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;
      let weatherIcon = document.createElement('img');
      weatherIcon.src = iconUrl;
      weatherDisplay.appendChild(weatherIcon);

      weatherDisplay.classList.remove('hidden');
      document.getElementById('error-message').parentElement.classList.add('hidden');
      return weatherData;
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
      const weatherData = getWeatherByCityAndState(city, state);
      console.log(weatherData);

      // Generate search term based on weather data
      const searchTerm = getSearchTerm(glWeatherData.temp, glWeatherData.windSpeed);

      // Search for a YouTube video using the generated search term
      searchVideo(searchTerm);
    } else {
      getWeatherByCityAndState(city);

      // Generate search term based on weather data
      const searchTerm = getSearchTerm(weatherData.temp, weatherData.windSpeed);

     // Search for a YouTube video using the generated search term
     searchVideo(searchTerm);
    }
  }
});


$('#location-input').on('keydown', function (event) {
    if (event.keyCode === 13) {
        $('#getWeatherBtn').click();
  
    }
})*/


  //This isn't functioning correctly and we also should've saved the weather data of the last place 
  /*
  function unHideContent() {
    if (currentVideoIndex) {
      $("#content").removeClass("hidden");
      console.log(currentVideoIndex);
      embedVideo(videoHistory[currentVideoIndex]);
    }
  }

  unHideContent();*/
});
