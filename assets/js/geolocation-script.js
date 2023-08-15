
// Geolocation code snippet modified from https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API

$(document).ready(function () {

  const geoLocateButton = document.querySelector("#geolocate-btn");

  //const descriptionInput = $('#description-input');
  const videoContainer = $('#video-container');
  const urlContainer = $('#url-container');
  const ytTitle = $('yt-title');
  const ytDesc = $('yt-desc');

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
    const apiKey = 'AIzaSyAefGEgFgDSYr7YSaSoBSSZojDDAYk5Xlo';
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
  function getSearchTerm(temp, windSpeed) {
    const temperatureWords = {
      hot: ["scorching", "blazing", "sizzling", "hot", "sweaty", "summer", "sun", "party"],
      warm: ["spring", "comfy", "warm", "crisp"],
      cool: ["fall", "chilly", "refreshing", "crisp", "dew"],
      cold: ["winter", "freezing", "frigid", "icy", "snow"]
    };

    const windSpeedWords = {
      slow: ["calm", "tranquil", "gentle", "chill", "slow", "beats", "lo-fi", "lo-fi beats"],
      fast: ["breezy", "upbeat", "windy", "dance", "edm", "fast"]
    };

    const ytMusicIdentifier = ["vevo", "song", "soundcloud", "bandcamp"];

    let temperatureCondition;
    if (parseFloat(temp) > 30.0) {
      temperatureCondition = "hot";
    } else if (parseFloat(temp) > 20.0) {
      temperatureCondition = "warm";
    } else if (parseFloat(temp) > 10.0) {
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

    const randomMusicIdentifier = ytMusicIdentifier[Math.floor(Math.random() * ytMusicIdentifier.length)];
    const randomTemperatureWord = temperatureWords[temperatureCondition][Math.floor(Math.random() * temperatureWords[temperatureCondition].length)];
    const randomWindSpeedWord = windSpeedWords[windSpeedCondition][Math.floor(Math.random() * windSpeedWords[windSpeedCondition].length)];

    let searchTerm = `${randomMusicIdentifier} ${randomTemperatureWord} ${randomWindSpeedWord}`;

    $('#yt-desc').html("We've found some music for you based on these criteria: " + "<br><br>" + randomTemperatureWord + "<br>" + randomWindSpeedWord + "<br><br>" + "Happy listening!!");
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


      console.log(player.getVideoData().description);
      console.log(videoTitle);

      $("#content").removeClass("hidden");

      // Populate ytTitle and ytDesc with video title and description
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
    console.log(searchTerms);
    searchVideo(searchTerms);
  });


  //Applies the click event to the geolocate button and calls all the required functions
  geoLocateButton.addEventListener("click", async () => {
    try {
      //Gets coordinates
      const coordinates = await getLatAndLong(); // Needed to await result of promise
      console.log("Latitude:", coordinates.latitude, "Longitude:", coordinates.longitude); // Delete

      //Gets the weather by the Lat and Long and applies it to the weatherData object
      const weatherData = await getWeatherByLatAndLong(coordinates.latitude, coordinates.longitude);
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
    if (currentVideoIndex > 0) { // ...if index is greater than 0...
      currentVideoIndex--; // ... decrease it by 1...
      embedVideo(videoHistory[currentVideoIndex]); //... embedVideo using the videoHistory's data, and currentVideoIndex to get the previous video
      saveCurrentVideoIndex();
    }
  });

  $('#next').click(function () {
    if (currentVideoIndex < videoHistory.length - 1) {
      currentVideoIndex++;
      embedVideo(videoHistory[currentVideoIndex]);
      saveCurrentVideoIndex();
    }
    // make it so that if currentVideoIndex is at 0, a new video is searched and embedded
  });

  $('#clear-history').click(function () {
    localStorage.removeItem('videoHistory'); // Clear the video history from localStorage
    videoHistory = []; // Clear the videoHistory array in memory
    currentVideoIndex = -1; // Reset currentVideoIndex
  })
});
