document.addEventListener("DOMContentLoaded", function() {

    //Get user's IP
    fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        const IP_ADDRESS = data.ip;

        //Call geolocation API ot get user's location latitude/longitude
        fetch(`https://geolocation-db.com/json/${IP_ADDRESS}&position=true`)
        .then(response => response.json())
        .then(data => {
            const latitude = data.latitude;
            const longitude = data.longitude;

            getWeather(latitude, longitude);
        })
        .catch(error => {
            console.log('Error fetching location data', error);
        })

    })
    .catch(error => {
        console.log('Error fetching IP data', error);
    });

    let fahrenheit;
    let celsius;

    function getWeather(latitude, longitude){

        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        
        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const celsius = Math.floor(data.current_weather.temperature);
            fahrenheit = Math.floor((celsius * 9/5) + 32);
            const weatherCode = data.current_weather.weathercode;

            const condition = (weatherCode) => {
                switch (weatherCode) {
                    case 0:
                        return 'clear skies';
                    case 1:
                        return 'partly cloudy';
                    case 2:
                        return 'cloudy';
                    case 3:
                        return 'mostly cloudy';
                    case 45:
                    case 48:
                        return 'foggy';
                    case 51:
                    case 53:
                    case 55:
                    case 56:
                    case 57:
                        return 'drizzling';
                    case 61:
                    case 63:
                    case 64:
                    case 66:
                    case 67:
                        return 'raining';
                    case 71:
                    case 73:
                    case 75:
                    case 77:
                        return 'snowing';
                    case 80:
                    case 81:
                    case 82:
                        return 'rain showers';
                    case 85:
                    case 86:
                        return 'snow showers';
                    case 96:
                    case 99:
                        return 'thunderstorms';
                    default:
                        return 'sunny';
                }
            };

            //Default display temp in fahrenheit
            document.getElementById('temp-main').textContent = `${fahrenheit}`;
            document.getElementById('temp-side').textContent = `${fahrenheit}`;

            document.getElementById('condition').textContent = `It's ${condition(weatherCode)} today!`;
        })
        .catch(error => {
            console.log('Failed to fetch weather data', error);
        })
    }

    //Get day or night to display different app settings
    const now = new Date();
    const currentHour = now.getHours();
    const isDayTime = currentHour > 6 && currentHour < 20;
    const imageContainer = document.getElementById('image-container');
    const cloudLayer = document.getElementById('clouds');
    const bigBubble = document.getElementsByClassName('big-bubble');
    const tempDisplay = document.getElementsByClassName('temp');
    
    //Set background image based on time of day
    if (isDayTime){
        imageContainer.style.backgroundImage = "url('assets/backgrounds/day-background.png')";
        cloudLayer.src = 'assets/backgrounds/day-clouds.png';
        for (let i = 0; i < bigBubble.length; i++){
            bigBubble[i].style.opacity = '.60';
        }
        for (let i = 0; i < tempDisplay.length; i++){
            tempDisplay[i].style.color = 'rgb(217, 180, 220)';
        }
    } else {
        imageContainer.style.backgroundImage = "url('assets/backgrounds/night-background.png')";
        cloudLayer.src = 'assets/backgrounds/night-clouds.png';
        for (let i = 0; i < bigBubble.length; i++){
            bigBubble[i].style.opacity = '.68';
        }
        for (let i = 0; i < tempDisplay.length; i++){
            tempDisplay[i].style.color = 'rgb(42, 117, 171)';
        }
    }

    //Fahrenheit/celsius button temperature toggle
    const celsiusBtn = document.getElementById('celsius-btn');
    const fahrenheitBtn = document.getElementById('fahrenheit-btn');

    celsiusBtn.addEventListener('click', function() {
        if (celsius == undefined ){
            document.getElementById('temp-main').textContent = '20';
            document.getElementById('temp-side').textContent = '20';
        } else {
            document.getElementById('temp-main').textContent = `${celsius}`;
            document.getElementById('temp-side').textContent = `${celsius}`;
        }
    })
    fahrenheitBtn.addEventListener('click', function() {
        if (fahrenheit == undefined ){
            document.getElementById('temp-main').textContent = '68';
            document.getElementById('temp-side').textContent = '68';
        } else {
        document.getElementById('temp-main').textContent = `${fahrenheit}`;
        document.getElementById('temp-side').textContent = `${fahrenheit}`;
        }
    })

    const bearImage = document.getElementById('bear');
    const images = [
        'assets/bear/bear1.png', 'assets/bear/bear1.png', 'assets/bear/bear2.png', 'assets/bear/bear3.png', 'assets/bear/bear4.png', 'assets/bear/bear5.png', 'assets/bear/bear6.png', 'assets/bear/bear7.png', 'assets/bear/bear8.png', 'assets/bear/bear9.png', 'assets/bear/bear10.png', 'assets/bear/bear11.png', 'assets/bear/bear11.png', 'assets/bear/bear12.png', 'assets/bear/bear12.png', 'assets/bear/bear14.png', 'assets/bear/bear14.png', 'assets/bear/bear13.png', 'assets/bear/bear13.png', 'assets/bear/bear13.png', 'assets/bear/bear13.png', 'assets/bear/bear11.png'
    ]

    let imgIndex = 0;
    let increasing = true;

    bearImage.src = `${images[imgIndex]}`;

    function changeImage() {
        bearImage.src = images[imgIndex];

        if (increasing){
            imgIndex++;
            if (imgIndex === images.length) {
                increasing = false;
                imgIndex = images.length-11;
            }
        } else {
            imgIndex--;
            if (imgIndex === -1){
                increasing = true;
                imgIndex = 0;
            }
        }
    }

    setInterval(changeImage, 200)


})
