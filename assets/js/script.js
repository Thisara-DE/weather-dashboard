var getLatLngFromCity = function(city) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=4a6b93cc16d18aa04545c8e3d49857b2";

    // make a request to the Geocoding API to convert city name into lat and lng
    fetch(apiUrl)
        .then(function(response) {
            if(response.ok) {
                response.json().then(function(data) {
                    latitude = data[0].lat;
                    longitude = data[0].lon;                    
                    getWeatherInfo(city, latitude, longitude);                    
                });
            } else {
                alert("Sorry, we couldn't find that city");
            }
        })
        .catch(function(error) {
            alert("Unable to connect to the weather app");
        });
}
getLatLngFromCity("tampa");

var getWeatherInfo = function(lat, lng) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lng + "&exclude=minutely,hourly,alerts&units=imperial&&appid=4a6b93cc16d18aa04545c8e3d49857b2";

    fetch(apiUrl)
        .then(function(response) {
            if(response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                })
            }
        })
}

