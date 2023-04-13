// OpenWeatherMap API key
const API_KEY = "732e0c2678f04ec88d42d3e72b677a9d";

// elements for user input, buttons, and weather display
const searchCityInput = document.getElementById("search-city");
const searchBtn = document.getElementById("search-btn");
const searchHistory = document.getElementById("search-history");
const currentWeather = document.querySelector(".current-weather");
const forecast = document.querySelector(".forecast");

// event listener for search button
searchBtn.addEventListener("click", () => {
  const city = searchCityInput.value;
  if (city) {
    fetchWeather(city);
  }
});

// event listener for search history
searchHistory.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    fetchWeather(e.target.textContent);
  }
});

// function to fetch weather data for city
function fetchWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        .then((response) => response.json())
        .then((data) => {
        // display current weather data
        displayCurrentWeather(data);
        // add searched city to history
        addToSearchHistory(city);
        // return coordinates
        return data.coord;
    })
    .then((coord) => {
        // fetch forecast data using coordinates
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly,alerts&appid=${API_KEY}&units=metric`)
            .then((response) => response.json())
            .then((data) => {
        // display 5-day forecast
        displayForecast(data.daily.slice(1, 6));
      });
  });
}

// function to display current weather data for city
function displayCurrentWeather(data) {
const date = new Date(data.dt * 1000).toLocaleDateString();
const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
currentWeather.innerHTML = `
  <h2>${data.name} (${date})</h2>
  <img src="${iconUrl}" alt="${data.weather[0].description}">
  <p>Temperature: ${data.main.temp}°C</p>
  <p>Humidity: ${data.main.humidity}%</p>
  <p>Wind Speed: ${data.wind.speed} m/s</p>
`;
}

// function to display 5-day forecast
function displayForecast(dailyData) {
forecast.innerHTML = "";
dailyData.forEach((day) => {
    const date = new Date(day.dt * 1000).toLocaleDateString();
    const iconUrl = `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
    const card = document.createElement("div");
    card.classList.add("forecast-card");
    card.innerHTML = `
        <h3>${date}</h3>
        <img src="${iconUrl}" alt="${day.weather[0].description}">
        <p>Temperature: ${day.temp.day}°C</p>
        <p>Wind Speed: ${day.wind_speed} m/s</p>
        <p>Humidity: ${day.humidity}%</p>
    `;
  forecast.appendChild(card);
});
}

// function to add city to search history
function addToSearchHistory(city) {
    // create new button element
    const btn = document.createElement("button");
    // set button's text content to the city
    btn.textContent = city;
    // append button to search history element
    searchHistory.appendChild(btn);
}