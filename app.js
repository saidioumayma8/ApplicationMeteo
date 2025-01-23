const form = document.querySelector('.weatherForm');
const cityInput = document.querySelector('.cityInput');
const todayCard = document.querySelector('.todayCard');
const forecastCards = document.querySelector('.forecastWeather');

const apiKey = 'b9a72d3da73af89c5fff14a9c5b57c7b';

const getWeatherData = async (lat, lon) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
};

const getForecastData = async (lat, lon) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
};

const displayTodayWeather = (data) => {
    const cityName = document.querySelector('.cityName');
    const temperature = document.querySelector('.temperature');
    const description = document.querySelector('.description');
    const weatherIcon = document.querySelector('.weatherIcon');
    const details = document.querySelector('.details');

    cityName.textContent = data.name;
    temperature.textContent = `${data.main.temp} °C`;
    description.textContent = data.weather[0].description;
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    details.textContent = `Humidity: ${data.main.humidity}% | Wind Speed: ${data.wind.speed} km/h`;
};

const displayForecastWeather = (data) => {
    forecastCards.innerHTML = ''; // Clear previous forecast

    for (let i = 0; i < 5; i++) {
        const forecast = data.list[i];
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecastCard');

        const forecastDay = document.createElement('h2');
        forecastDay.textContent = `Day ${i + 1}`;
        const forecastTemp = document.createElement('p');
        forecastTemp.textContent = `${forecast.main.temp} °C`;
        const forecastIcon = document.createElement('img');
        forecastIcon.src = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

        forecastCard.appendChild(forecastDay);
        forecastCard.appendChild(forecastTemp);
        forecastCard.appendChild(forecastIcon);
        forecastCards.appendChild(forecastCard);
    }
};

const getLocationAndFetchData = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        const weatherData = await getWeatherData(latitude, longitude);
        displayTodayWeather(weatherData);

        const forecastData = await getForecastData(latitude, longitude);
        displayForecastWeather(forecastData);
    });
};

const searchCity = async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        displayTodayWeather(data);

        const forecastData = await getForecastData(data.coord.lat, data.coord.lon);
        displayForecastWeather(forecastData);
    }
};

// Load weather data on page load
window.onload = getLocationAndFetchData;

// Handle search form submit
form.addEventListener('submit', searchCity);
