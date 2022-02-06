// DOPM elements
var formContainerEl = document.querySelector("#form-container");
var submitBtnEl = document.querySelector("#searchBtn")
var todayWeatherEl = document.querySelector("#today-container");
var todayWeatherTitleEl = document.querySelector("#city-date");
var currWeatherDescEl = document.querySelector("#weather-desc");
var currWeatherIconEl = document.querySelector("#weatherImage");
var forecastTitleEl = document.querySelector("#forecast-title");
var cardContainerEl = document.querySelector("#forecast-container");

// Day counter for the forecast
var dayNumber = 1;


// form submit
var buttonEventHandler = function(event) {
    console.log(event.target);
    var cityInput = document.querySelector("input[name='city']").ariaValueMax;
    console.log(cityInput);


}


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

                    // calling the weather forecast function
                    displayWeatherForecast(data.daily);
                });
            } else {
                alert("Bad request");
            }
        })
}


var displayCurrentWeather = function(city, date, weatherDesc, iconUrl, currTemp, wind, humidity, uvIndex) {
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

var displayWeatherForecast = function(daily) {
    forecastTitleEl.textContent = "5-Day Forecast:";

    for(var i = 0; i < 5; i++) {        
        // 5 day forecast items                                        
        dateForecast = new Date(daily[dayNumber].dt*1000).toLocaleDateString();                              
        iconTagForecast = daily[dayNumber].weather[0].icon;
        iconForecastUrl = "http://openweathermap.org/img/wn/" + iconTagForecast + "@2x.png";
        tempHigh = daily[dayNumber].temp.max + "\u00B0F"; 
        tempLow = daily[dayNumber].temp.min + "\u00B0F";
        windForecast = daily[dayNumber].wind_speed +" MPH";
        humidityForecast = daily[dayNumber].humidity + " %";
        
        // creating a card element to hold the data
        var cardEl = document.createElement("div");
        cardEl.className = "my-card";

        var cardHeader = document.createElement("h3");
        cardHeader.className = "card-header";
        cardHeader.textContent = dateForecast;        

        var weatherIconEl = document.createElement("img");
        weatherIconEl.setAttribute("src", iconForecastUrl);

        var tempHighEl = document.createElement("p");
        tempHighEl.textContent = "Temp High: " + tempHigh;
        
        var tempLowEl = document.createElement("p");
        tempLowEl.textContent = "Temp Low: " + tempLow;

        var windEl = document.createElement("p");
        windEl.textContent = "Wind: " + wind;

        var humidityEl = document.createElement("p");
        humidityEl.textContent = "Humidity: " + humidity;

        cardEl.appendChild(cardHeader);
        cardEl.appendChild(weatherIconEl);
        cardEl.appendChild(tempHighEl);
        cardEl.appendChild(tempLowEl);
        cardEl.appendChild(windEl);
        cardEl.appendChild(humidityEl);
        cardContainerEl.appendChild(cardEl);        

        dayNumber++;    
    };
}

submitBtnEl.addEventListener("submit", buttonEventHandler);
