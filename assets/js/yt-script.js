// Grabbing HTML elements
const searchButton = $('#search-button');
const descriptionInput = $('#description-input');
const videoContainer = $('#video-container');
const urlContainer = $('#url-container');

// Load the YouTube Data API client library
gapi.load('client', function () {
    console.log('YouTube Data API loaded.');

    // Attach the click event to the button
    searchButton.on('click', function () {
        searchVideo();
    });
});

// Function to search for videos based on the provided description
function searchVideo() {
    const apiKey = 'AIzaSyAefGEgFgDSYr7YSaSoBSSZojDDAYk5Xlo';
    const description = descriptionInput.val();
    const maxResults = 1; // Number of results to fetch

    // Use the API to search for videos by description
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
                const videoLink = `https://www.youtube.com/watch?v=${videoId}`;

                embedVideo(videoId);
                
                urlContainer.attr('href', videoLink);
                urlContainer.text(videoLink);
            }
        } else {
            console.log('No videos found with the given description.');
        }
    }).catch(function (error) {
        console.error('Error fetching videos:', error);
    });
};

function embedVideo(videoId) {
    // Create a new <div> element for the player
    const playerDiv = $('<div></div>').addClass('youtube-player');

    // Append the player div to the videoContainer
    videoContainer.empty().append(playerDiv);

    // Create a new YouTube player in the playerDiv
    new YT.Player(playerDiv[0], {
        videoId: videoId,
        width: 560,
        height: 315,
        playerVars: {
            // Other params
        }
    });
};
