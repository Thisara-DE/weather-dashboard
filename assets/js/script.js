// DOPM elements
var searchBtnEl = document.querySelector("#searchBtn");
var todayWeatherEl = document.querySelector("#today-container");
var todayWeatherTitleEl = document.querySelector("#city-date");
var currWeatherDescEl = document.querySelector("#weather-desc");
var currWeatherIconEl = document.querySelector("#weatherImage");
var forecastTitleEl = document.querySelector("#forecast-title");



// converting city name to lat and lng
var getLatLngFromCity = function(city) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=4a6b93cc16d18aa04545c8e3d49857b2";

    // make a request to the Geocoding API to convert city name into lat and lng
    fetch(apiUrl)
        .then(function(response) {
            if(response.ok) {
                response.json().then(function(data) {
                    latitude = data[0].lat;
                    longitude = data[0].lon;                    
                    getWeatherInfo(latitude, longitude, city);      
                    console.log(latitude,longitude);              
                });
            } else {
                alert("Sorry, we couldn't find that city");
            }
        })
        .catch(function(error) {
            alert("Unable to connect to the weather app");
        });
}
getLatLngFromCity("St Cloud");

// getting the weather from lat, lng
var getWeatherInfo = function(lat, lng, city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lng + "&exclude=minutely,hourly,alerts&units=imperial&&appid=4a6b93cc16d18aa04545c8e3d49857b2";

    fetch(apiUrl)
        .then(function(response) {
            console.log(apiUrl);
            if(response.ok) {
                response.json().then(function(data) {
                    // current weather items
                    iconTag = data.current.weather[0].icon;
                    iconUrl = "http://openweathermap.org/img/wn/" + iconTag + "@2x.png";
                    weatherDescRaw = data.current.weather[0].description;
                    weatherDesc =  weatherDescRaw.split(' ')
                    .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase()).join(' ');                    
                    date = new Date(data.current.dt*1000).toLocaleString();
                    currTemp = data.current.temp + "\u00B0F"; 
                    wind = data.current.wind_speed +" MPH";   
                    humidity = data.current.humidity + " %";   
                    uvIndex = data.current.uvi;                         
                    displayCurrentWeather(city, date, weatherDesc, iconUrl, currTemp, wind, humidity, uvIndex);
                    console.log(iconUrl);

                    // 5 day forecast items
                    dayNumber = 1;
                    date = new Date(data.daily[dayNumber].dt*1000).toLocaleDateString();                    
                    iconTagForecast = data.daily.weather[dayNumber].icon;
                    iconForecastUrl = "http://openweathermap.org/img/wn/" + iconTagForecast + "@2x.png";
                    console.log(iconForecastUrl);

                });
            } else {
                alert("Bad request");
            }
        })
}


var displayCurrentWeather = function(city, date, weatherDesc, iconUrl, currTemp, wind, humidity, uvIndex, event) {
    // todayWeatherEl.innerHTML = "";

    todayWeatherTitleEl.textContent = city + " " + date;
    currWeatherIconEl.setAttribute("src", iconUrl);
    currWeatherDescEl.textContent = weatherDesc;    

    // creating elements for current weather info
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + currTemp;

    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + wind;

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + humidity;

    var uvIndexEl = document.createElement("p");
    uvIndexEl.textContent = "UV Index: " + uvIndex;

    todayWeatherEl.append(tempEl, windEl, humidityEl, uvIndexEl);
}

var displayWeatherForecast = function() {

}

searchBtnEl.addEventListener("click", getLatLngFromCity);