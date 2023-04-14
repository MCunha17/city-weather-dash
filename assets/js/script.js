const API_KEY = "fc63f4de173e687876cfca0c1f000358";

// reference elements in HTML
let searchCityInput = document.getElementById("search-city");
let searchBtn = document.getElementById("search-btn");
let searchHistory = document.getElementById("search-history");
let currentWeather = document.querySelector(".current-weather");
let forecast = document.querySelector(".forecast");
let weatherContent = document.querySelector('.weather-content');

// click event listener for search button
searchBtn.addEventListener("click", () => {
  // get value of search input
  const city = searchCityInput.value;
  // fetch and display weather of inputted city
  if (city) {
    fetchWeather(city);
    weatherContent.style.display = 'block';
  }
});

// click event listener to the search history
searchHistory.addEventListener("click", (e) => {
  // fetch weather for city
  if (e.target.tagName === "BUTTON") {
    fetchWeather(e.target.textContent);
    weatherContent.style.display = 'block';
  }
});

// function to fetch the current weather
function fetchWeather(city) {
  // fetch current weather from API
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then((response) => response.json())
    .then((data) => {
      // display current weather
      displayCurrentWeather(data);
      // add city to search history
      addToSearchHistory(city);
      // return city coordinates
      return data.coord;
    })
    .then((coord) => {
      // fetch forecast from API
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}&units=metric`)
        .then((response) => response.json())
        .then((data) => {
          // display forecast
          displayForecast(data.list.slice(0, 40).filter((_, index) => index % 8 === 0));
        });
    });
}

// function to display current weather
function displayCurrentWeather(data) {
  // get date
  const date = new Date(data.dt * 1000).toLocaleDateString();
  // get weather icon
  const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  // display current weather
  currentWeather.innerHTML = `
    <h2>${data.name} (${date})</h2>
    <img src="${iconUrl}" alt="${data.weather[0].description}">
    <p>Temperature: ${data.main.temp}°C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;
  // make current weather visible
  currentWeather.style.display = 'block';
  currentWeather.classList.add("border");
}

// function to display forecast
function displayForecast(forecastData) {
  forecast.innerHTML = "";
  // create forecast cards
  forecastData.forEach((day) => {
    const date = new Date(day.dt * 1000).toLocaleDateString();
    const iconUrl = `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
    const card = document.createElement("div");
    card.classList.add("forecast-card");
    card.innerHTML = `
      <h3>${date}</h3>
      <img src="${iconUrl}" alt="${day.weather[0].description}">
      <p>Temperature: ${day.main.temp}°C</p>
      <p>Wind Speed: ${day.wind.speed} m/s</p>
      <p>Humidity: ${day.main.humidity}%</p>
    `;
    forecast.appendChild(card);
  });
}

// function to add a button for a city in the search history
function addToSearchHistory(city) {
  const btn = document.createElement("button");
  btn.textContent = city;
  searchHistory.appendChild(btn);
}