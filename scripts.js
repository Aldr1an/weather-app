
document.querySelector('#input-form').addEventListener("submit", function (e) {
    e.preventDefault()
    let city_name = document.querySelector('#city-input').value
    run(city_name)

})

async function run(city_name) {
    try {
        const response = await fetch (`https://geocoding-api.open-meteo.com/v1/search?name=${city_name}&count=10&language=en&format=json`)
        const data = await response.json()
        const { results } = data
        const {name, latitude, longitude} = results[0]
        const weather_response = await fetch (`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
        const weather_data = await weather_response.json()
        const { current_weather } = weather_data
        const { temperature, weathercode } = current_weather
        display(name, temperature, weathercode)
    } catch (error) {
        console.log(error)
    }
}

function display(name, temperature, weathercode) {
    document.querySelector(".display-weather").innerHTML = `
    <h2>${name}</h2>
    <p>Temperature: ${temperature}°C</p>
    <P>Weather Code: ${weathercode}`
}