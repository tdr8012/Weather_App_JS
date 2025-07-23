const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "d7c6d84bafbd9a28bac90fad59fb66ba";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value.trim();

    // Check if the city input is empty
    if (!city) {
        displayError("Please enter a city name.");
        return;
    }

    try {
        // Fetch weather data for the entered city
        const weatherData = await getWeatherData(city);
        // Display the fetched weather information
        displayWeatherInfo(weatherData);
    } catch {
        // Handle errors during fetch
        displayError("Error fetching weather data. Please try again.");
    }
});

// Fetch weather data from OpenWeatherMap API
async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("City not found");
    return await response.json();
}

// Display weather information on the page
function displayWeatherInfo(data) {
    try {
        const cityName = document.querySelector(".cityName");
        const temperature = document.querySelector(".temperature");
        const description = document.querySelector(".description");
        const humidity = document.querySelector(".humidityDisplay");
        const weatherIcon = document.querySelector(".weatherIcon");

        // Check if all required elements exist
        if (!cityName || !temperature || !description || !humidity || !weatherIcon) {
            displayError("Some display elements are missing.");
            return;
        }

        // Destructure relevant data from API response
        const { name, main: { temp, humidity: hum }, weather: [{ description: desc, icon }] } = data;

        // Update UI with weather data
        cityName.textContent = name;
        temperature.textContent = `${Math.round(temp - 273.15).toFixed(1)}°C`;
        description.textContent = desc.charAt(0).toUpperCase() + desc.slice(1);
        humidity.textContent = `Humidity: ${hum}%`;
        weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        weatherIcon.alt = `Weather icon for ${desc}`;

        console.log(icon);
        console.log(weatherIcon.src); // Log the image source for debugging

        card.style.display = "block";
    } catch {
        // Handle errors during display
        displayError("Error displaying weather information. Please try again.");
    }
}

// Display error messages on the page
function displayError(message) {
    const errorElement = document.querySelector(".errorDisplay");
    if (errorElement) errorElement.textContent = message;
    card.style.display = "flex";
}
