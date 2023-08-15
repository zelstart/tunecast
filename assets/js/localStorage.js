
function saveVideos(videoLink, videoId) { // not sure which one of these i need for the embedVideo function. have to call this function I think on line 115 of geolocation-script.js, passing the link or id as an argument
    let videoHistory = JSON.parse(localStorage.getItem('videoHistory')) || [] // array to hold video urls
      videoHistory.unshift(videoLink); // add new item to the front of the array
      localStorage.setItem('videoHistory', JSON.stringify(videoHistory)); // Store the updated history in localStorage
      console.log('VIDEO HISTORY: ', videoHistory);
  }

let videoHistory = JSON.parse(localStorage.getItem('videoHistory')) || [];
let currentVideoIndex = -1; // sets the value of currentVideoIndex to use for moving forward/backwards through the array

$('#prev').click(function () { // on prev button click...
  if (currentVideoIndex > 0) { // ...if index is greater than 0...
    currentVideoIndex--; // ... decrease it by 1...
    embedVideo(videoHistory[currentVideoIndex]); //... embedVideo using the videoHistory's data, and currentVideoIndex to get the previous video
  }
});

$('#next').click(function () {
  if (currentVideoIndex < videoHistory.length - 1) {
    currentVideoIndex++;
    embedVideo(videoHistory[currentVideoIndex]);
  }
  // make it so that if currentVideoIndex is at 0, a new video is searched and embedded
});