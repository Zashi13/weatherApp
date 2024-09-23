let sunriseMin;
let sunsetMin;
let sunriseHours;
let sunsetHours;
let totalSunHours;
let todayDate = new Date().toDateString();
let currentTime = new Date().getHours();
let pastSunTime;
let defaultLat = 61.7445;
let defaultLong = 17.0260;
let snow = false;

function getWeatherAPI(lat, long){
    return new Promise(function(resolve, reject){
        fetch("https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+long+"&daily=weather_code,sunrise,sunset&timezone=auto")
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

function findCityOptions(){

}

function getCities(){
    let selectedCity = document.getElementById("location").value;
    return new Promise(function(resolve, reject){
        fetch("assets/geo/cities500.json")
        .then(response => response.json())
        .then(data => {
            const city = data.find(item => item.name === selectedCity);
            resolve({
             city
            });
        })
        .catch(error => {
            reject(error);
        });
    });
}

function autofill(city){
    let latitude = city.city.lat;
    let longitude = city.city.lon;
    console.log(latitude, longitude);
    let inputLat = document.getElementById("lat");
    let inputLong = document.getElementById("long");
    inputLat.value = latitude;
    inputLong.value = longitude;
}


function displayweather(weatherCode){
    let main = document.getElementById("main");
    console.log(main);
    while (main.firstChild) {
        main.removeChild(main.lastChild);
      }
    let mainTitle = document.createElement("h1");
    mainTitle.id = "mainTitle";
    main.appendChild(mainTitle);
    let bgm = document.getElementById("bgm");
    let audioSrc;
    switch(75){
        case 0:
            main.className= "clear";
            titleTextContent = "Perfectly clear sky!"
            clear();
            audioSrc = "clear";
            break;
        case 1:
            main.className = "clear";
            main.classList.add("mainlyClear");
            titleTextContent = "There are some clouds"
            clear();
            createCloud(3, 5);
            audioSrc = "clear";
            break;
        case 2:
            main.className = "clear";
            main.classList.add("partlyCloudy");
            titleTextContent = "It's a bit cloudy"
            clear();
            createCloud(5, 8);
            audioSrc = "clear";
            break;
        case 3:
            main.className="overcast";
            titleTextContent = "It's overcast"
            audioSrc = "overcast";
            break;
        case 45:
        case 48:
            main.className="fog";
            titleTextContent = "Can't see with all that fog"
            break;
        case 51:
        case 53:
        case 56:
            main.className="drizzle";
            titleTextContent = "The worst kind of rain"
            audioSrc = "drizzle";
            break;
        case 55:
        case 57:
           main.className="drizzle";
            main.classList.add("drizzleHeavy");
            titleTextContent = "The worst kind of rain - and a lot of it"
            audioSrc = "drizzle";
            break;
        case 66:
           main.className="freezingRain";
            titleTextContent = "So thats freezing rain"
            break;
        case 67:
            main.className="freezingRain";
            main.classList.add("freezingRainHeavy");
            titleTextContent = "That freezing rain sucks..."
            break;
        case 71:
        case 85:
           main.className="snow";
            titleTextContent = "At least there are some flakes"
            snow = true;
            rain(50);
            break;
        case 73:
            main.className="snow";
            main.classList.add("snowModerate");
            titleTextContent = "It's snowing";
            snow = true;
            rain(150);
            break;
        case 75:
        case 86:
            main.className="snow";
            main.classList.add("snowHeavy");
            titleTextContent = "Look at all that snow!";
            snow = true;
            rain(250);
            break;
        case 77:
            main.className="snow";
            main.classList.add("snowGrain");
            titleTextContent = "Why is the snow so weird?";
            break;
        case 80:
            main.className="rainScene";
            titleTextContent = "It's a little rainy today";
            audioSrc = "rain";
            rain(20);
            break;
        case 81:
            main.className="rainScene";
            main.classList.add("rainModerate");
            titleTextContent = "It's raining";
            audioSrc = "rain";
            rain(120);
            break;
        case 82:
            main.className="rainScene";
            main.classList.add("rainHeavy");
            titleTextContent = "It's raining A LOT!";
            audioSrc = "rain";
            rain(400);
            wind();
            break;
        case 95:
            main.className="thunderstorm";
            titleTextContent = "There is a Thunderstorm happening!";
            rain(500);
            audioSrc = "thunder";
            break;
        case 96:
        case 99:
            main.className="thunderstorm";
            main.classList.add("thunderstormHail");
            titleTextContent = "Take cover! It's hailing!";
            break;
        default:
            main.className="hell";
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
    let randomDelay = Math.round(randomNumberInRange(1, 12000));
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

function changeLocation(){
    let latUnshort = document.getElementById("lat").value;
    let longUnshort = document.getElementById("long").value;

    let lat = latUnshort.slice(0,6);
    let long = longUnshort.slice(0,6);

    getWeatherAPI(lat, long).then(splitData).then(displayweather);
}

function rain(rainAmount){
/*----------Creating and appending all the child elements for the rain---------*/
    const main = document.getElementById("main");
    let backRow = document.createElement("div");
    let frontRow = document.createElement("div");
    backRow.classList.add("rain");
    backRow.classList.add("front-row");
    frontRow.classList.add("rain");
    frontRow.classList.add("back-row");
    main.appendChild(backRow);
    main.appendChild(frontRow);

    /*---RainJS--- stolen from Aaron Rickle on Codepen------*/
      
        var increment = 0;
        let windowWidth = Number(screen.width / 10);
          let toIncrement = Number(windowWidth / rainAmount);
        var drops = "";
        var backDrops = "";
      
        while (increment < 100) {
          //couple random numbers to use for various randomizations
          //random number between 98 and 1
          var randoHundo = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
          //random number between 5 and 2
          var randoFiver = (Math.floor(Math.random() * (5 - 2 + 1) + 2));
          var snowSpeed = (Math.floor(Math.random() * (5 - 2 + 1) + 3));
          console.log(randoFiver);
          //increment
          increment += toIncrement;
          if (snow != true){
          //add in a new raindrop with various randomizations to certain CSS properties
          drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 120) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
          backDrops += '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
        }
else{
    drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 120) + '%; animation-delay:' + randoFiver +'.'+ randoHundo + 's; animation-duration:' + snowSpeed +'.'+ randoHundo + 's;"><div class="stem snowFlake" style="animation-delay:' + randoFiver +'.'+ randoHundo + 's; animation-duration:' + snowSpeed +'.'+ randoHundo + 's;"></div></div>';
          backDrops += '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay:' + randoFiver +'.'+ randoHundo + 's; animation-duration:' + snowSpeed +'.'+ randoHundo + 's;"><div class="stem snowFlake" style="animation-delay:' + randoFiver +'.'+ randoHundo + 's; animation-duration:' + snowSpeed +'.'+ randoHundo + 's;"></div></div>';
}
    }
      
        $('.rain.front-row').append(drops);
        $('.rain.back-row').append(backDrops);
}

function wind(windAmount) {
   let allDrops = document.querySelectorAll(".stem");
   for(i = 1; i < allDrops.length; i++){
   allDrops[i].classList.add("wind");
  }
}
getWeatherAPI(defaultLat, defaultLong).then(splitData).then(displayweather);