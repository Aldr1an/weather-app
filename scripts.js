
const weatherDescript = {
    0:  { name: "Clear sky",              category: "clear",  icon: "☀️" },
    1:  { name: "Mainly clear",           category: "clear",  icon: "🌤️" },
    2:  { name: "Partly cloudy",          category: "cloud",  icon: "⛅" },
    3:  { name: "Overcast",              category: "cloud",  icon: "☁️" },
    45: { name: "Fog",                    category: "fog",    icon: "🌫️" },
    48: { name: "Depositing rime fog",    category: "fog",    icon: "🌫️" },
    51: { name: "Light drizzle",          category: "rain",   icon: "🌦️" },
    53: { name: "Moderate drizzle",       category: "rain",   icon: "🌧️" },
    55: { name: "Dense drizzle",          category: "rain",   icon: "🌧️" },
    61: { name: "Slight rain",            category: "rain",   icon: "🌧️" },
    63: { name: "Moderate rain",          category: "rain",   icon: "🌧️" },
    65: { name: "Heavy rain",             category: "rain",   icon: "🌧️" },
    71: { name: "Slight snowfall",        category: "snow",   icon: "🌨️" },
    73: { name: "Moderate snowfall",      category: "snow",   icon: "❄️" },
    75: { name: "Heavy snowfall",         category: "snow",   icon: "❄️" },
    80: { name: "Slight rain showers",    category: "rain",   icon: "🌦️" },
    81: { name: "Moderate rain showers",  category: "rain",   icon: "🌧️" },
    82: { name: "Violent rain showers",   category: "storm",  icon: "🌧️" },
    95: { name: "Thunderstorm",           category: "storm",  icon: "⛈️" },
    99: { name: "Thunderstorm + hail",    category: "storm",  icon: "⛈️" },
    };
document.querySelector('#input-form').addEventListener("submit", function (e) {
    e.preventDefault()
    let city_name = document.querySelector('#city-input').value
    document.querySelector('#city-name').textContent = city_name
    run(city_name)
    document.body.classList.add("searched")
})

async function run(city_name) {
    try {
        const response = await fetch (`https://geocoding-api.open-meteo.com/v1/search?name=${city_name}&count=10&language=en&format=json`)
        const data = await response.json()
        const { results } = data
        if (!results || results.length === 0){
            document.querySelector(".display-weather").innerHTML = `
            <h2>no data found... </h2>`
            return
        }
        const {name, latitude, longitude} = results[0]
        const weather_response = await fetch (`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=7&timezone=auto`)
        const weather_data = await weather_response.json()
        const { current, daily } = weather_data
        const { temperature_2m, weathercode, apparent_temperature, time  } = current
        const forecast = []
        daily.time.forEach((date, index) => {
            const maxTemp = daily.temperature_2m_max[index]
            const minTemp = daily.temperature_2m_min[index]
            const code = daily.weathercode[index]
            forecast.push({
                date: date,
                max: maxTemp,
                min: minTemp,
                weathercode: code
            })
        })
        display(name, temperature_2m, weathercode, forecast, apparent_temperature, time)
    } catch (error) {
        console.log(error)
    }
}

function display(name, temperature, weathercode, forecast, feeltemp, current_time) {

    const description = weatherDescript[weathercode] || { name: "Unknown", icon: "❓" }
    const  korent_day = new Date(current_time).toLocaleDateString('en-US', { weekday: "long"})
    const forecastHTML = forecast.reduce((acc, item) => {
        const dayDescription = weatherDescript[item.weathercode] || { name: "Unknown", icon: "❓" }
        const dayname = new Date(item.date).toLocaleDateString('en-US', { weekday: 'short'})
        return acc + `
        <div class=forecast-card>
            <p class='fore-icon'>${dayname}</p>
            <span class='fore-icon' id='fore-icon'>${dayDescription.icon}</span>
            <p class='fore-sub-icon'>${dayDescription.name}</p>
            <p class='fore-icon'>${item.max}°</p>
            <p class='fore-sub-icon'>${item.min}°</p> 
        </div>`
    }, "")    
    document.querySelector(".display-current-weather").innerHTML = `
        <section class='content-wrapper'>
            <div class='hero-card'>
                <div class='sub-top'>
                    <p>${name}</p>
                    <p>${korent_day}</p>
                </div>
                <div class='hero-content'>
                    <div class='text'>
                        <h2>${temperature}°C</h2>
                        <p>${description.name}</p>
                    </div>
                    <div class='icon'>
                        <span>${description.icon}</span>
                        <p>feel like ${feeltemp}°C</p>
                    </div>
                </div>
            </div>
            <div>
            <h3 id='text-forecast'>This week's Forecast</h3>
            </div>
            <div class=forecast-container>
                ${forecastHTML}
            </div>

        </section>
    `
}