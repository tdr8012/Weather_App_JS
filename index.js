const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "d7c6d84bafbd9a28bac90fad59fb66ba";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value.trim();

    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            displayError("Error fetching weather data. Please try again.");
        }
    } else {
        displayError("Please enter a city name.");
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) throw new Error("City not found");
    return await response.json();
}



function getWeatherIcon(iconCode) {
   
}
function displayError(message) {
    const errorElement = document.querySelector(".errorDisplay");
    if (errorElement) {
        errorElement.textContent = message;
    }
    card.style.display = "flex";
}
