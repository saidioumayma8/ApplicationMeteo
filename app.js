const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const mainWeather = document.querySelector(".mainWeather");
const apikey = "b9a72d3da73af89c5fff14a9c5b57c7b";

// Default city to show on load
const defaultCity = "Beni Mellal";

// Fetch weather for the default city on page load
window.addEventListener("load", () => {
    fetchWeatherData(defaultCity);
});

// Handle form submission
weatherForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    } else {
        alert("Please enter a city.");
    }
    cityInput.value = ""; // Clear input
});

// Fetch both current weather and 5-day forecast
async function fetchWeatherData(city) {
    try {
        const [currentWeather, forecastData] = await Promise.all([
            getCurrentWeather(city),
            getFiveDayForecast(city),
        ]);

        displayWeather(currentWeather, forecastData);
    } catch (error) {
        console.error(error);
        alert("Failed to fetch weather data. Please try again.");
    }
}

// Fetch current weather data
async function getCurrentWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error("Failed to fetch current weather.");
    }
    return await response.json();
}

// Fetch 5-day/3-hour forecast data
async function getFiveDayForecast(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error("Failed to fetch 5-day forecast.");
    }
    return await response.json();
}

// Display the weather data
function displayWeather(currentWeather, forecastData) {
    mainWeather.innerHTML = ""; // Clear previous data

    // Extract current weather details
    const {
        name: city,
        main: { temp, humidity },
        weather: [{ description }],
    } = currentWeather;

    const currentTempCelsius = (temp - 273.15).toFixed(2);

    // Create current weather card
    const currentWeatherCard = `
        <div class="card">
            <h1 class="cityDisplay">${city} (Today)</h1>
            <p class="tempDisplay">Temperature: ${currentTempCelsius}°C</p>
            <p class="humidityDisplay">Humidity: ${humidity}%</p>
            <p class="descDisplay">${description}</p>
        </div>
    `;
    mainWeather.insertAdjacentHTML("beforeend", currentWeatherCard);

    // Extract and display 5-day forecast
    const dailyForecast = getDailyForecast(forecastData);
    dailyForecast.forEach((day) => {
        const { date, temp, description } = day;

        const forecastCard = `
            <div class="card">
                <h2>${date}</h2>
                <p class="tempDisplay">Temperature: ${temp}°C</p>
                <p class="descDisplay">${description}</p>
            </div>
        `;
        mainWeather.insertAdjacentHTML("beforeend", forecastCard);
    });
}

// Extract daily forecast from API data
function getDailyForecast(data) {
    const dailyData = {};

    data.list.forEach((entry) => {
        const date = entry.dt_txt.split(" ")[0];
        if (!dailyData[date]) {
            dailyData[date] = {
                temp: (entry.main.temp - 273.15).toFixed(2),
                description: entry.weather[0].description,
            };
        }
    });

    return Object.entries(dailyData).map(([date, details]) => ({
        date,
        temp: details.temp,
        description: details.description,
    }));
}
