'use strict';

const apiKey = '31c7df93fe54a4ba72b947868403b5cd';
const cityInput = document.querySelector('#search');
const searchBtn = document.querySelector('#searchButton');
const currentBtn = document.querySelector('#currentButton');
const locationElement = document.querySelector('#city');
const temperatureElement = document.querySelector('#temperature');
const weatherIconElement = document.querySelector('#icon');
const dateTimeElement = document.querySelector('.weather-widget__date');
const descriptionElement = document
  .querySelector('.weather-widget__description');

function updateWeatherData(data) {
  const location = data.name;
  const temperature = `${Math.round(data.main.temp)}`;
  const weatherDescription = data.weather[0].description;
  const iconCode = data.weather[0].icon;
  const date = new Date();
  const dateTime = date.toLocaleString('en-GB', {
    weekday: 'long', hour: '2-digit', minute: '2-digit',
  });

  locationElement.textContent = location;
  temperatureElement.textContent = temperature;

  weatherIconElement.src
   = `https://openweathermap.org/img/wn/${iconCode}`
   + `@2x.png`;
  dateTimeElement.textContent = dateTime;

  descriptionElement.textContent
  = `${weatherDescription.charAt(0).toUpperCase()}`
  + weatherDescription.slice(1);
}

async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}`
      + `&appid=${apiKey}&units=metric`,
    );
    const data = await response.json();

    if (data.cod === 200) {
      updateWeatherData(data);
    } else {

    }
  } catch (error) {

  }
}

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();

  if (city) {
    fetchWeather(city);
  }
});

async function getCurrentWeather() {
  try {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async(position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}`
            + `&lon=${lon}&appid=${apiKey}&units=metric`,
          );
          const data = await response.json();

          if (data.cod === 200) {
            updateWeatherData(data);
          } else {
            showErrorMessage('Error: City not found or invalid coordinates.');
          }
        } catch (error) {
          showErrorMessage('Error fetching weather data: ' + error.message);
        }
      },
      (error) => {
        showErrorMessage('Geolocation error: ' + error.message);
      });
    } else {
      showErrorMessage('Geolocation is not supported by this browser.');
    }
  } catch (error) {
    showErrorMessage('Unexpected error: ' + error.message);
  }
}

function showErrorMessage(message) {
  const errorMessage = document.createElement('div');

  errorMessage.textContent = message;

  errorMessage.style = 'color: red; position: fixed; top: 10px; left: 50%; '
  + 'transform: translateX(-50%); background: #f8d7da; padding: 10px; '
  + 'border: 1px solid #f5c6cb; border-radius: 5px;';
  document.body.appendChild(errorMessage);

  setTimeout(() => errorMessage.remove(), 3000);
}

currentBtn.addEventListener('click', () => {
  getCurrentWeather();
});

fetchWeather('Lviv');
