const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
let card = document.querySelector(".card");
const apiKey = "d7c6d84bafbd9a28bac90fad59fb66ba";
let searchButton = document.querySelector(".submitButton");


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
    console.log(response)
    if (!response.ok) throw new Error("City not found");
    return await response.json();
}

/**
 * Display weather information on the page
 */
function displayWeatherInfo(data) {
    try {
        console.log(data); // Log the entire data object for debugging
        const cityName = document.querySelector(".cityName");
        const temperature = document.querySelector(".temperature");
        const description = document.querySelector(".description");
        const humidityDisplay = document.querySelector(".humidityDisplay");
        const weatherIcon = document.querySelector(".weatherIcon");
        const dateTime = document.querySelector(".dateTime");
        const timeDisplay = document.querySelector(".timeDisplay");
        
        // Check if all required elements exist
        if (!weatherIcon || !dateTime || !timeDisplay) {
            throw new Error("Missing weather display elements");
        }

        // Destructure relevant data from API response
        const { 
            name, 
            timezone, 
            main: { temp, humidity }, 
            weather: [{ description: desc, icon, id }] 
        } = data;

        console.log("name:", name);
        console.log("timezone:", timezone);
        console.log("temp:", temp);
        console.log("humidity:", humidity);
        console.log("desc:", desc);
        console.log("icon:", icon);

        // Update UI with weather data
        cityName.textContent = name;
        temperature.textContent = `${Math.round(temp - 273.15).toFixed(1)}°C`;
        description.textContent = desc.charAt(0).toUpperCase() + desc.slice(1);
        humidityDisplay.textContent = `Humidity: ${humidity}%`;
        weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        weatherIcon.alt = `Weather icon for ${desc}`;
        dateTime.textContent = initializeDate(dt, timezone);
        timeDisplay.textContent = initializeTime(dt, timezone);
        card.style.background = changeBackgroundColor(id);
        searchButton.style.background = changeBackgroundColor(id);
        card.style.display = "block";
    } catch {
        // Handle errors during display
        displayError("Error displaying weather information. Please try again.");
    }
}



function initializeDate(utcSeconds, timezoneOffset) {
    const utcMillis = (utcSeconds + timezoneOffset) * 1000;
    const localDate = new Date(utcMillis);

    const date = localDate.getDate();
    const month = localDate.getMonth() + 1;
    const year = localDate.getFullYear();

    return `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
}

function initializeTime(utcSeconds, timezoneOffset) {
    const utcMillis = (utcSeconds + timezoneOffset) * 1000;
    const localDate = new Date(utcMillis);

    let hours = localDate.getHours();
    let minutes = localDate.getMinutes();
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes.toString().padStart(2, '0');

    return `${hours}:${minutes} ${meridiem}`;
}


// Display error messages on the page
function displayError(message) {
    const errorElement = document.querySelector(".errorDisplay");
    if (errorElement) errorElement.textContent = message;
    card.style.display = "flex";
}

function changeBackgroundColor(id) {
    let colorBackground ;
    if (id >= 200 && id < 300) {
        colorBackground = "linear-gradient(135deg, #ffcc00 0%, #ff8800 100%)"; // Thunderstorm
    } else if (id >= 300 && id < 400) {
        colorBackground = "linear-gradient(135deg, #b2fefa 0%, #0ed2f7 100%)"; // Drizzle
    } else if (id >= 500 && id < 600) {
        colorBackground = "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)"; // Rain
    } else if (id >= 600 && id < 700) {
        colorBackground = "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)"; // Snow
    } else if (id >= 700 && id < 800) {
        colorBackground = "linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)"; // Atmosphere
    } else if (id === 800) {
        colorBackground = "linear-gradient(135deg, #fceabb 0%, #f8b500 100%)"; // Clear
    }
    return colorBackground;
}