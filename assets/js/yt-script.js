// Grabbing HTML elements
const searchButton = $('#search-button')
const descriptionInput = $('#description-input')

const videoContainer = $('#video-container');

const urlContainer = $('#url-container');

// Function to search for videos based on the provided description
function searchVideo() {
    const apiKey = 'AIzaSyAefGEgFgDSYr7YSaSoBSSZojDDAYk5Xlo';
    const description = descriptionInput.val();
    const maxResults = 1; // Number of results to fetch

    // Use the API to search for videos by description
    // TAKEN FROM GOOGLE API REFERENCES DOCUMENTATION
    gapi.client.init({
        'apiKey': apiKey,
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
    }).then(function () {
        return gapi.client.youtube.search.list({
            q: description,
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
                const title = item.snippet.title;
                const description = item.snippet.description;
                const videoLink = `https://www.youtube.com/watch?v=${videoId}`;

                console.log('Video Title:', title);
                console.log('Video Description:', description);
                console.log('Video Link:', videoLink);
                //embedVideo(videoId);

                urlContainer.attr('href', videoLink);
                urlContainer.text(videoLink);
            }
        } else {
            console.log('No videos found with the given description.');
        }
    }, function (error) {
        console.error('Error fetching videos:', error);
    });
}


function embedVideo(videoId) {
    videoContainer.innerHTML = `
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/${videoId}"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      ></iframe>
    `;
  }


// When the document is ready, attach the click event to the button
$(document).ready(function () {
    searchButton.on('click', function () {
        searchVideo();
    });
});

// Load the YouTube Data API client library
gapi.load('client', function () {
    console.log('YouTube Data API loaded.');
});
