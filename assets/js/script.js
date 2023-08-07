$(document).ready(function () {

    function getWeatherData(city) {
        let apiKey = fc83ec8cd64eb691a5994da1280e5c60;
        let weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
        let apiWeatherEl = weatherUrl + city +'&appid=' + apiKey;
   fetch(apiWeatherEl)
   .then(function (urlResponse) {
    if (urlResponse.ok) {
        urlResponse.json().then(function() {
        })
    }
   })
}


})