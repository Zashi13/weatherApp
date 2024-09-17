let sunriseMin;
let sunsetMin;
let sunriseHours;
let sunsetHours;
let totalSunHours;
let todayDate = new Date().toDateString();
let currentTime = new Date().getHours();
let pastSunTime;

function getWeatherAPI(){
    return new Promise(function(resolve, reject){
        fetch('https://api.open-meteo.com/v1/forecast?latitude=61.7445&longitude=17.0260&daily=weather_code,sunrise,sunset&timezone=auto')
        .then(response => response.json())
        .then(data => {
            resolve({
                weatherCode: data.daily.weather_code[0],
                sunrise: data.daily.sunrise[0],
                sunset: data.daily.sunset[0]
            });
        })
        .catch(error => {
            reject(error);
        });
    });
}


function displayweather(weatherCode){
    let main = document.getElementById("main");
    let mainTitle = document.getElementById("mainTitle");
    let bgm = document.getElementById("bgm");
    let audioSrc;
    switch(2){
        case 0:
            main.classList.add("clear");
            titleTextContent = "Perfectly clear sky!"
            clear();
            audioSrc = "clear";
            break;
        case 1:
            main.classList.add("clear");
            main.classList.add("mainlyClear");
            titleTextContent = "There are some clouds"
            clear();
            createCloud(3, 5);
            audioSrc = "clear";
            break;
        case 2:
            main.classList.add("clear");
            main.classList.add("partlyCloudy");
            titleTextContent = "It's a bit cloudy"
            clear();
            createCloud(5, 8);
            audioSrc = "clear";
            break;
        case 3:
            main.classList.add("overcast");
            titleTextContent = "It's overcast"
            audioSrc = "overcast";
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
            audioSrc = "drizzle";
            break;
        case 55:
        case 57:
            main.classList.add("drizzle");
            main.classList.add("drizzleHeavy");
            titleTextContent = "The worst kind of rain - and a lot of it"
            audioSrc = "drizzle";
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
            audioSrc = "rain";
            break;
        case 81:
            main.classList.add("rain");
            main.classList.add("rainModerate");
            titleTextContent = "It's raining";
            audioSrc = "rain";
            break;
        case 82:
            main.classList.add("rain");
            main.classList.add("rainHeavy");
            titleTextContent = "It's raining A LOT!";
            audioSrc = "rain";
            break;
        case 95:
            main.classList.add("thunderstorm");
            titleTextContent = "There is a Thunderstorm happening!";
            audioSrc = "thunder";
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
    bgm.src="assets/aud/" + audioSrc + ".mp3";
    
}

function splitData(data){
    /*-------Calculate SunHours - Rise and Set time etc. ------*/
    let sunriseClock = data.sunrise.slice(11);
    let sunsetClock = data.sunset.slice(11);
    calcSunHours(sunriseClock, sunsetClock);
    return data.weatherCode;
}

function calcSunHours(sunriseClock, sunsetClock){
    sunriseHours = sunriseClock.slice(0, 2);
    sunriseMin = sunriseClock.slice(3);
    sunsetHours = sunsetClock.slice(0, 2);
    sunsetMin = sunsetClock.slice(3);
    totalSunHours = (Number((sunsetHours - sunriseHours))) + Number(60 / (sunriseMin + sunsetMin));
    pastSunTime = Number(currentTime - sunriseHours);
}

function clear(){
    let isNight = changeSkyColor("fff2bd", "eab589", "db7f7e", "776e99");
    /*----------Check if its night--------*/
    if(isNight !== true){
    /*----Display the sun icon------*/
    createSun();
}
}

function createSun(){
    let main = document.getElementById("main"); //Find the element that cntains the sky
    let wrapper = document.createElement("wrapper"); //what des this do?
    wrapper.id="celestialWrapper";

      /*creating the sun containing a face*/
    let sunwrapper = document.createElement("div"); //contains the sun svg and face svg 
    sunwrapper.id = "celestialBody"; //set ID for sunWrapper

    let sun = document.createElement("img"); //create the sun element
    sun.src = "assets/sunIcon.svg" //assign sun-svg
    sun.id ="sun";
    let face = document.createElement("img"); //create the face element
    face.id="sunface"; //assign id to identify face element
    face.src="assets/face.svg" // assign face svg

    sunwrapper.appendChild(sun); //assign both images to the sunwrapper
    sunwrapper.appendChild(face);

    wrapper.appendChild(sunwrapper);
    main.appendChild(wrapper);
    moveCelestialBody(sunwrapper);
}

function createMoon(){
    let main = document.getElementById("main");
    let moon = document.createElement("img");
    moon.id = "celestialBody";
    moon.src = "assets/moonIcon.svg"
    main.appendChild(moon);
    moveCelestialBody(moon);
}

function moveCelestialBody(objectToChange){
    let offset = 25;
    let offsetAmount = 100 / 24;
for (let i = 1; i < currentTime; i++){
    offset += offsetAmount;
}
    objectToChange.style.setProperty('--offsetAmount', offset + "%");
    /*objectToChange.style.transition = "all 3s";*/
}

function changeSkyColor(color1, color2, color3, color4){
    let diffToSunset = Number(totalSunHours - pastSunTime);
    if(pastSunTime < 2 || diffToSunset < 2){
        if(currentTime < sunriseHours || currentTime > sunsetHours){
            nightTime();
            return true;
        }
        else{
    let gradientLocation;
    if(pastSunTime < 2){
        gradientLocation = "at bottom left";
    }
    if(Number(totalSunHours - pastSunTime) < 2){
        gradientLocation = "at bottom right";
    }
    main.style.setProperty("background", "radial-gradient(circle "+gradientLocation+", #"+color1+" 0%, #"+color2+" 25%, #"+color3+" 52%, #"+color4+" 100%)", "important");  
}}

};

function nightTime(){
    main.classList.add("night");
    for (let i = 1; i <= 3; i++){
    let stars = document.createElement("div");
    stars.id ="stars" + i;
    main.appendChild(stars); 
}
createMoon();
}

function createCloud(min, max){
    const randomNumberInRange = (min, max) => Math.random() * (max - min) + min;
let numberOfClouds = Math.round(randomNumberInRange(min, max));

let main = document.getElementById("main");

for(let i = 1; i <= numberOfClouds; i++){
    let randomDelay = Math.round(randomNumberInRange(1, 8000));
    /*------------Creat Cloud-----------*/
    let cloud = document.createElement("img");
    cloud.classList.add("cloud");
    cloud.id = "cloud" + i;
    /*------------CreateRandomCloudSpeed-------------*/
    let randomNum = Math.round(randomNumberInRange(1, 3));
    cloud.classList.add("cloudSpeed" + randomNum);
    /*------------CreateRandomCloudLook--------------*/
    let cloudLook = Math.round(randomNumberInRange(1, 5));
    switch (cloudLook){
        case 1:
            cloud.src = "assets/cloudOne.svg"
            break;
        case 2:
            cloud.src = "assets/cloudTwo.svg"
            break;
        case 3:
            cloud.src = "assets/cloudBig.svg"
            break;
        case 4:
            cloud.src = "assets/cloudBigTwo.svg"
            break;
        default:
            cloud.src = "assets/cloudOne.svg"
          }
          cloud.style.setProperty('--randomDelay', Number(randomDelay / 1000) + "s");
    main.appendChild(cloud);
    /*------------CreateRandomPosition-------------*/
    let top = Math.round(randomNumberInRange(10, 70));
    cloud.style.top = top + "%";


    /*-------------SetRandomDelay----------*/
}


}

getWeatherAPI().then(splitData).then(displayweather);