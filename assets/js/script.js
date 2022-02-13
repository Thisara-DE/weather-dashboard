// DOPM elements
var formContainerEl = document.querySelector("#form-container");
var submitBtnEl = document.querySelector("#searchBtn");
var todayWeatherContainerEl = document.querySelector("#todayEl");
var forecastTitleEl = document.querySelector("#forecast-title");
var cardContainerEl = document.querySelector("#forecast-container");
var historyContainerEl = document.querySelector("#past-searches-container");

// Day counter for the forecast
var dayNumber = 1;
// todayWeatherEl.innerHTML = "";
// todayWeatherEl.className = "";

// form submit
var buttonEventHandler = function(event) { 
    // todayWeatherEl.innerHTML = "";
    
    var cityInput = document.querySelector("#city").value;

    

    if(!cityInput) {
        alert("Enter a city name to proceed")
    } else {
        getLatLngFromCity(cityInput); 
               
    }
}

var loadHistoricData = function() {
    for(var i = 0; i < 5; i++) {
        var cityInput = localStorage.getItem("city ");
        console.log(cityInput);
        var searchHistoryEl = document.createElement("button");
        // searchHistoryEl.classList = "button is-primary";
        searchHistoryEl.textContent = cityInput;

        historyContainerEl.appendChild(searchHistoryEl);
    }
}

loadHistoricData();

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
                    
                    // saving the city name in LocalStorage
                    localStorage.setItem("city", city);

                    // calling the weather forecast function                    
                    displayWeatherForecast(data.daily);
                });
            } else {
                alert("Bad request");
            }
        })
}


var displayCurrentWeather = function(city, date, weatherDesc, iconUrl, currTemp, wind, humidity, uvIndex) { 
    todayWeatherContainerEl.innerHTML = "";    

    var todayWeatherEl = document.createElement("div");
    todayWeatherEl.setAttribute("id", "today-container");
    todayWeatherEl.className = "today-cont";

    var currWeatherDescEl = document.createElement("div");
    currWeatherDescEl.setAttribute("id", "weather-desc");     

    var todayWeatherTitleEl = document.createElement("h2");
    todayWeatherTitleEl.textContent = city + " " + date;

    var currWeatherDescEl = document.createElement("p");
    currWeatherDescEl.textContent = weatherDesc;


    var currWeatherIconEl = document.createElement("img");
    currWeatherIconEl.setAttribute("src", iconUrl);

    // creating elements for current weather info
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + currTemp;

    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + wind;

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + humidity;

    var uvIndexEl = document.createElement("p");
    uvIndexEl.textContent = "UV Index: " + uvIndex;

    todayWeatherEl.append(todayWeatherTitleEl, currWeatherDescEl, currWeatherIconEl, tempEl, windEl, humidityEl, uvIndexEl);
    todayWeatherContainerEl.appendChild(todayWeatherEl);
    
}

var displayWeatherForecast = function(daily) {
    forecastTitleEl.textContent = "5-Day Forecast:";

    cardContainerEl.innerHTML = "";

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

submitBtnEl.addEventListener("click", buttonEventHandler);
