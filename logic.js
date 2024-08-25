function getWeatherAPI(){
    return new Promise(function(resolve, reject){
        fetch('https://api.open-meteo.com/v1/forecast?latitude=46.6847&longitude=7.6911&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto')
    .then(response => response.json())
    .then(data => resolve(data.daily.weather_code[0]));
})
}

function displayweather(weatherCode){
    let main = document.getElementById("main");
    let mainTitle = document.getElementById("mainTitle");
    switch(0){
        case 0:
            main.classList.add("clear");
            titleTextContent = "Perfectly clear sky!"
            clear();
            break;
        case 1:
            main.classList.add("clear");
            main.classList.add("mainlyClear");
            titleTextContent = "There are some clouds"
            break;
        case 2:
            main.classList.add("clear");
            main.classList.add("partlyCloudy");
            titleTextContent = "It's a bit cloudy"
            break;
        case 3:
            main.classList.add("overcast");
            titleTextContent = "It's overcast"
            break;
        case 45:
        case 48:
            main.classList.add("fog");
            titleTextContent = "Can't see with all that fog"
            break;
        case 51:
        case 53:
        case 56:
            main.classList.add("drizzle");
            titleTextContent = "The worst kind of rain"
            break;
        case 55:
        case 57:
            main.classList.add("drizzle");
            main.classList.add("drizzleHeavy");
            titleTextContent = "The worst kidn of rain - and a lot of it"
            break;
        case 66:
            main.classList.add("freezingRain");
            titleTextContent = "So thats freezing rain"
            break;
        case 67:
            main.classList.add("freezingRain");
            main.classList.add("freezingRainHeavy");
            titleTextContent = "That freezing rain sucks..."
        case 71:
        case 85:
            main.classList.add("snow");
            titleTextContent = "At least there are some flakes"
            break;
        case 73:
            main.classList.add("snow");
            main.classList.add("snowModerate");
            titleTextContent = "It's snowing";
            break;
        case 75:
        case 86:
            main.classList.add("snow");
            main.classList.add("snowHeavy");
            titleTextContent = "Look at all that snow!";
            break;
        case 77:
            main.classList.add("snow");
            main.classList.add("snowGrain");
            titleTextContent = "Why is the snow so weird?";
            break;
        case 80:
            main.classList.add("rain");
            titleTextContent = "It's a little rainy today";
            break;
        case 81:
            main.classList.add("rain");
            main.classList.add("rainModerate");
            titleTextContent = "It's raining";
            break;
        case 82:
            main.classList.add("rain");
            main.classList.add("rainHeavy");
            titleTextContent = "It's raining A LOT!";
            break;
        case 95:
            main.classList.add("thunderstorm");
            titleTextContent = "There is a Thunderstorm happening!";
            break;
        case 96:
        case 99:
            main.classList.add("thunderstorm");
            main.classList.add("thunderstormHail");
            titleTextContent = "Take cover! It's hailing!";
            break;
        default:
            main.classList.add("hell");
            titleTextContent = "Could not find weather - welcome to Hell!"
    }

    mainTitle.innerText = titleTextContent;
    
}

getWeatherAPI().then(displayweather);

function clear(){
    let main = document.getElementById("main");
    let sun = document.createElement("div");
    sun.id = "sun";
    main.appendChild(sun);
    for (let i = 0; i <= 7; i++){
        let sunRay = document.createElement("span");
        sunRay.id = "sunRay" + i;
        sunRay.className = "sunRay";
        sun.appendChild(sunRay);
    }

}