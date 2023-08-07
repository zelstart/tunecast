var apiKey = fc83ec8cd64eb691a5994da1280e5c60;
var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
function getWeatherData(city) {
   var apiWeatherEl = weatherUrl + city +'&appid=' + apiKey;
   fetch(apiWeatherEl)
   .then(function (urlResponse) {
    if (urlResponse.ok) {
        urlResponse.json().then(function() {
        })
    }
   })
}