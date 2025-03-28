
const API_KEY = '209fded22ad2ae0509c5014d97ba6a81';


document.getElementById('sub-btn').addEventListener('click', function (event) {
    event.preventDefault();
    getWeather();
});


async function getWeather() {
    const cityName = document.getElementById('cityInput').value;
    if (!cityName) {
        alert('Please enter a city name.');
        return;
    }

    // API URLs
    const weatherUrl =` https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`;

    try {
        // Get current weather data
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
            alert('City not found. Please enter a valid city name.');
            return;
        }
        const weatherData = await weatherResponse.json();
        // console.log(weatherData)
        displayWeather(weatherData);

        // Get forecast data
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
        generateTemperatureChart(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Display main weather info
function displayWeather(data) {
    document.getElementById('city-name').innerText = `${data.name}`;
    document.getElementById('temperature').innerText = `Temperature: ${data.main.temp}°C`;
    document.getElementById('condition').innerText = `Condition: ${data.weather[0].description}`;
    document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').innerText = `Wind Speed: ${data.wind.speed} km/h`;
    document.getElementById('air-quality').innerText = `Air Quality: Moderate`;

    // Change background video based on weather condition
    changeBackgroundVideo(data.weather[0].main);
}

function changeBackgroundVideo(condition) {
    const videoElement = document.getElementById('bg-video');
    const videoSource = document.getElementById('video-source');

    switch (condition.toLowerCase()) {
        case 'clear':
            videoSource.src = 'clear_sky.mp4';
            break;
        case 'clouds':
            videoSource.src = 'clody.mp4';
            break;
        case 'rain':
            videoSource.src = 'rainy.mp4';
            break;
        case 'thunderstorm':
            videoSource.src = 'thunder_strome.mp4';
            break;
        case 'snow':
            videoSource.src = 'snow_1.mp4';
            break;
        
        case 'fog':
            videoSource.src = 'fog.mp4';
            break;
        case 'haze':
            videoSource.src = 'haze.mp4';
            break;
        default:
            videoSource.src = 'default.mp4'; // Fallback video
            break;
    }

    // Reload video to apply changes
    videoElement.load();
}


// Display hourly and weekly forecast
function displayForecast(data) {
    const hourlyContainer = document.getElementById('hourly-forecast');
    const weeklyContainer = document.getElementById('weekly-forecast');
    hourlyContainer.innerHTML = '';
    weeklyContainer.innerHTML = '';

    // Get hourly and daily forecast
    for (let i = 0; i < 8; i++) {
        const hourly = data.list[i];
        hourlyContainer.innerHTML += generateForecastCard(hourly, 'Hourly');
    }

    for (let i = 0; i < data.list.length; i += 8) {
        const daily = data.list[i];
        weeklyContainer.innerHTML += generateForecastCard(daily, 'Weekly');
    }
}

// Generate forecast card
function generateForecastCard(data, type) {
    return `
        <div class="forecast-card">
            <h4>${type === 'Hourly' ? formatHour(data.dt) : formatDate(data.dt)}</h4>
            <p>${data.weather[0].description}</p>
            <p>${data.main.temp}°C</p>
        </div>
    `;
}

// Format date and time
function formatHour(timestamp) {
    const date = new Date(timestamp * 1000);
    return`${date.getHours()}:00`;
}

function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toDateString();
}

// Generate temperature trend chart
function generateTemperatureChart(data) {
    const ctx = document.getElementById('tempChart').getContext('2d');
    const labels = data.list.slice(0, 8).map(item => formatHour(item.dt));
    const temps = data.list.slice(0, 8).map(item => item.main.temp);
    const bgcolor='red'

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature Trend (°C)',
                data: temps,
                color:'red',
                borderColor: 'black',
                borderWidth: 1,
              
                borderColor: ['black'],
                
            }]
        },
        options: {
           
            responsive: true,
            scales: {
                x: {
                    ticks: {
                        color: 'black',  // Change X-axis label color
                        font: {
                            size: 16  // Adjust font size
                        }
                    }
                },
                y: {
                    ticks: {
                        color: 'black',  // Change Y-axis label color
                        font: {
                            size: 16
                        }
                    }
                }
            }
        }
        
      });
}