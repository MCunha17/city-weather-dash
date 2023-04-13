const API_KEY = "fc63f4de173e687876cfca0c1f000358";

const searchCityInput = document.getElementById("search-city");
const searchBtn = document.getElementById("search-btn");
const searchHistory = document.getElementById("search-history");
const currentWeather = document.querySelector(".current-weather");
const forecast = document.querySelector(".forecast");

searchBtn.addEventListener("click", () => {
  const city = searchCityInput.value;
  if (city) {
    fetchWeather(city);
  }
});

searchHistory.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    fetchWeather(e.target.textContent);
  }
});

function fetchWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(data);
      addToSearchHistory(city);
      return data.coord;
    })
    .then((coord) => {
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}&units=metric`)
        .then((response) => response.json())
        .then((data) => {
          displayForecast(data.list.slice(0, 40).filter((_, index) => index % 8 === 0));
        });
    });
}

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

function displayForecast(forecastData) {
  forecast.innerHTML = "";
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

function addToSearchHistory(city) {
  const btn = document.createElement("button");
  btn.textContent = city;
  searchHistory.appendChild(btn);
}

