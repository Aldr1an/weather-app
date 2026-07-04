
document.querySelector('#input-form').addEventListener("submit", function (e) {
    e.preventDefault()
    let city_name = document.querySelector('#city-input').value
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
        const weather_response = await fetch (`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=7&timezone=auto`)
        const weather_data = await weather_response.json()
        const { current_weather, daily } = weather_data
        const { temperature, weathercode } = current_weather
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
        });
        display(name, temperature, weathercode)
    } catch (error) {
        console.log(error)
    }
}

function display(name, temperature, weathercode) {
    document.querySelector(".display-weather").innerHTML = `
    <h2>${name}</h2>
    <p>Temperature: ${temperature}°C</p>
    <p>Weather Code: ${weathercode}</p>`
}