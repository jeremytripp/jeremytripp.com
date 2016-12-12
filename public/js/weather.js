var request = require('request');
var cityid = "5128581";
var units = "imperial";
var OWkey = "463213179d9637496377d4ead1cc7f08";
var temp;
var city = "New York";
var condition;
var highTemp;
var lowTemp;
var summary;
var iconTable = {
        "01d": "wi-day-sunny",
        "02d": "wi-day-cloudy",
        "03d": "wi-cloudy",
        "04d": "wi-cloudy-windy",
        "09d": "wi-showers",
        "10d": "wi-rain",
        "11d": "wi-thunderstorm",
        "13d": "wi-snow",
        "50d": "wi-fog",
        "01n": "wi-night-clear",
        "02n": "wi-night-cloudy",
        "03n": "wi-night-cloudy",
        "04n": "wi-night-cloudy",
        "09n": "wi-night-showers",
        "10n": "wi-night-rain",
        "11n": "wi-night-thunderstorm",
        "13n": "wi-night-snow",
        "50n": "wi-night-alt-cloudy-windy",
        "clear-day": "wi-day-sunny",
        "clear-night": "wi-night-clear",
        "rain": "wi-rain",
        "snow": "wi-snow",
        "sleet": "wi-sleet",
        "wind": "wi-day-windy",
        "fog": "wi-fog",
        "cloudy": "wi-cloudy",
        "partly-cloudy-day": "wi-day-cloudy",
        "partly-cloudy-night": "wi-night-cloudy",
        "hail": "wi-hail",
        "thunderstorm": "wi-thunderstorm",
        "tornado": "wi-tornado"
};
var icon;

// Set the headers
var headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
};

// Configure the request
var OWoptions = {
    url: 'http://api.openweathermap.org/data/2.5/weather',
    method: 'GET',
    headers: headers,
    qs: {'id': cityid, 'units': units, 'APPID': OWkey}
};

var DSoptions = {
    url: 'https://api.darksky.net/forecast/45419e765b9252c9e340f64f430b0189/40.779265,-73.948631',
    method: 'GET',
    headers: headers,
    qs: {'exclude': 'minutely,flags,alerts'}
};

function getWeather (weatherService, callback) {
    if (weatherService === "OpenWeather") {
            request(OWoptions, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    temp = parseInt(Math.round(data.main.temp));
                    city = data.name;
                    condition = data.weather[0].main;
                    icon = iconTable[data.weather[0].icon];
                    switch (condition) {
                        case "Clear":
                            condition = "Clear";
                            break;
                        case "Rain":
                            condition = "Raining";
                            break;
                        case "Snow":
                            condition = "Snowing";
                            break;
                        case "Haze":
                            condition = "Hazy";
                            break;
                        case "Mist":
                            condition = "Misting";
                            break;
                        case "Clouds":
                            condition = "Cloudy";
                            break;
                        case 6:
                            condition = "Saturday";
                    }
                    callback({
                        temp: temp,
                        city: city,
                        condition: condition,
                        summary: "",
                        icon: icon
                    });

                }
            });
        // };
    } else if (weatherService === "Dark Sky") {
            request(DSoptions, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    // Print out the response body
                    // console.log(body);
                    var data = JSON.parse(body);
                    temp = parseInt(Math.round(data.currently.temperature));
                    condition = data.currently.summary;
                    icon = iconTable[data.currently.icon];
                    summary = data.hourly.summary;
                    highTemp = parseInt(Math.round(data.daily.data[0].temperatureMax));
                    lowTemp = parseInt(Math.round(data.daily.data[0].temperatureMin));
                    callback({
                        temp: temp,
                        city: city,
                        condition: condition,
                        summary: summary,
                        highTemp: highTemp,
                        lowTemp: lowTemp,
                        icon: icon
                    });

                }
            });
        // };
    }
}

module.exports = getWeather;