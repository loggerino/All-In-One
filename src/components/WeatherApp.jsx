import React, { useState, useEffect } from "react";
import axios from "axios";
import { ICON_MAP } from "./iconMap";

export function WeatherComponent() {
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(null);
  const [daily, setDaily] = useState([]);
  const [hourly, setHourly] = useState([]);

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        axios
          .get("https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true", {
            params: {
              latitude: coords.latitude,
              longitude: coords.longitude,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
          })
          .then(({ data }) => {
            const weatherData = {
              current: parseCurrentWeather(data),
              daily: parseDailyWeather(data),
              hourly: parseHourlyWeather(data),
            };
            renderWeather(weatherData);
          })
          .catch((e) => {
            console.error(e);
            alert("Error getting weather.");
          });
      },
      () => {
        alert("Error getting location");
      }
    );

    function getWeatherDescription(iconCode) {
      switch (iconCode) {
        case 0:
        case 1:
          return 'Sunny';
        case 2:
          return 'Partly Cloudy';
        case 3:
          return 'Cloudy';
        case 45:
        case 48:
          return 'Smog';
        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
        case 80:
        case 81:
        case 82:
          return 'Heavy Showers';
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
          return 'Snow';
        case 95:
        case 96:
        case 99:
          return 'Thunderstorm';
        default:
          return '';
      }
    }

    function parseCurrentWeather({ current_weather, daily }) {
      const {
        temperature: currentTemp,
        windspeed: windSpeed,
        weathercode: iconCode,
      } = current_weather;

      const {
        temperature_2m_max: [maxTemp],
        temperature_2m_min: [minTemp],
        apparent_temperature_max: [maxFeelsLike],
        apparent_temperature_min: [minFeelsLike],
        precipitation_sum: [precip],
      } = daily;

      const weatherDescription = getWeatherDescription(iconCode); // Retrieve weather description

      return {
        currentTemp: Math.round(currentTemp),
        highTemp: Math.round(maxTemp),
        lowTemp: Math.round(minTemp),
        highFeelsLike: Math.round(maxFeelsLike),
        lowFeelsLike: Math.round(minFeelsLike),
        windSpeed: Math.round(windSpeed),
        precip: Math.round(precip * 100) / 100,
        iconCode,
        weatherDescription,
      };
    }


    function parseDailyWeather({ daily }) {
      return daily.time.map((time, index) => {
        return {
          timestamp: time,
          iconCode: daily.weathercode[index],
          maxTemp: Math.round(daily.temperature_2m_max[index])
        }
      })
    }

    function parseHourlyWeather({ hourly, current_weather }) {
      const currentTimestamp = new Date(current_weather.time).getTime();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      return hourly.time
        .map((time, index) => {
          return {
            timestamp: time,
            iconCode: hourly.weathercode[index],
            weatherDescription: getWeatherDescription(hourly.weathercode[index]),
            temp: Math.round(hourly.temperature_2m[index]),
            feelsLike: Math.round(hourly.apparent_temperature[index]),
            windSpeed: Math.round(hourly.windspeed_10m[index]),
            precip: Math.round(hourly.precipitation[index] * 100) / 100,
          };
        })
        .filter(({ timestamp }) => {
          const hourTime = new Date(timestamp).getTime();
          return hourTime >= currentTimestamp && hourTime <= tomorrow.getTime();
        });
    }

    function renderWeather(weatherData) {
      setCurrent(weatherData.current);
      setDaily(weatherData.daily);
      setHourly(weatherData.hourly);
    }

    const delay = 2000;

    const timer = setTimeout(() => {
      setLoading(false);
    }, delay);

    return () => {
      clearTimeout(timer);
    };

  }, []);

  function getIconUrl(iconCode) {
    return `icons/${ICON_MAP.get(iconCode)}.svg`
  }

  function renderCurrentWeather() {
    return (
      <header className="header">
        <div className="header-left">
          <img className="weather-icon large" src={getIconUrl(current?.iconCode)} />
          <div className="header-current-temp">
            <span>{current?.currentTemp}</span>&deg;
            <div className="weather-description-header">{current?.weatherDescription}</div>
          </div>
        </div>
        <div className="header-right">
          <div className="info-group">
            <div className="label">High</div>
            <div><span>{current?.highTemp}</span>&deg;</div>
          </div>
          <div className="info-group">
            <div className="label">FL High</div>
            <div><span>{current?.highFeelsLike}</span>&deg;</div>
          </div>
          <div className="info-group">
            <div className="label">Wind</div>
            <div><span>{current?.windSpeed}</span><span className="value-sub-info">kmh</span></div>
          </div>
          <div className="info-group">
            <div className="label">Low</div>
            <div><span>{current?.lowTemp}</span>&deg;</div>
          </div>
          <div className="info-group">
            <div className="label">FL Low</div>
            <div><span>{current?.lowFeelsLike}</span>&deg;</div>
          </div>
          <div className="info-group">
            <div className="label">Precip</div>
            <div><span>{current?.precip}</span><span className="value-sub-info">mm</span></div>
          </div>
        </div>
      </header>
    );
  }

  function renderDailyWeather() {
    return daily.map((day) => (
      <div className="day-card" key={day.timestamp}>
        <img src={getIconUrl(day.iconCode)} className="weather-icon" />
        <div className="day-card-date">{day.timestamp}</div>
        <div>{day.maxTemp}&deg;</div>
      </div>
    ));
  }

  function renderHourlyWeather() {
    return hourly.map((hour) => (
      <tr className="hour-row" key={hour.timestamp}>
        <td>
          <div className="info-group">
            <div className="label">{hour.day}</div>
            <div>{hour.timestamp}</div>
          </div>
        </td>
        <td>
          <td>
            <div className="weather-info">
              <img src={getIconUrl(hour.iconCode)} className="weather-icon" />
              <div className="weather-description">{hour.weatherDescription}</div>
            </div>
          </td>
        </td>
        <td>
          <div className="info-group">
            <div className="label">Temp</div>
            <div>{hour.temp}&deg;</div>
          </div>
        </td>
        <td>
          <div className="info-group">
            <div className="label">FL Temp</div>
            <div>{hour.feelsLike}&deg;</div>
          </div>
        </td>
        <td>
          <div className="info-group">
            <div className="label">Wind</div>
            <div>{hour.windSpeed}<span className="value-sub-info">kmh</span></div>
          </div>
        </td>
        <td>
          <div className="info-group">
            <div className="label">Precip</div>
            <div>{hour.precip}<span className="value-sub-info">mm</span></div>
          </div>
        </td>
      </tr>
    ));
  }

  return (
    <div className={`weather-container ${loading ? "blurred" : ""}`}>
      {loading && <><header class="header">
      <div class="header-left">
        <img class="weather-icon large" src="icons/sun.svg" data-current-icon />
        <div class="header-current-temp">
          <span data-current-temp>31</span>&deg;
        </div>
      </div>
      <div class="header-right">
        <div class="info-group">
          <div class="label">High</div>
          <div><span data-current-high>32</span>&deg;</div>
        </div>
        <div class="info-group">
          <div class="label">FL High</div>
          <div><span data-current-fl-high>27</span>&deg;</div>
        </div>
        <div class="info-group">
          <div class="label">Wind</div>
          <div>
            <span data-current-wind>9</span
            ><span class="value-sub-info">mph</span>
          </div>
        </div>
        <div class="info-group">
          <div class="label">Low</div>
          <div><span data-current-low>19</span>&deg;</div>
        </div>
        <div class="info-group">
          <div class="label">FL Low</div>
          <div><span data-current-fl-low>12</span>&deg;</div>
        </div>
        <div class="info-group">
          <div class="label">Precip</div>
          <div>
            <span data-current-precip>0.1</span
            ><span class="value-sub-info">in</span>
          </div>
        </div>
      </div>
    </header>
    <section class="day-section" data-day-section>
      <div class="day-card">
        <img src="icons/cloud.svg" class="weather-icon" />
        <div class="day-card-day">Monday</div>
        <div>32&deg;</div>
      </div>
      <div class="day-card">
        <img src="icons/cloud.svg" class="weather-icon" />
        <div class="day-card-day">Tuesday</div>
        <div>32&deg;</div>
      </div>
      <div class="day-card">
        <img src="icons/cloud.svg" class="weather-icon" />
        <div class="day-card-day">Wednesday</div>
        <div>32&deg;</div>
      </div>
      <div class="day-card">
        <img src="icons/cloud.svg" class="weather-icon" />
        <div class="day-card-day">Thursday</div>
        <div>32&deg;</div>
      </div>
      <div class="day-card">
        <img src="icons/cloud.svg" class="weather-icon" />
        <div class="day-card-day">Friday</div>
        <div>32&deg;</div>
      </div>
      <div class="day-card">
        <img src="icons/cloud.svg" class="weather-icon" />
        <div class="day-card-day">Saturday</div>
        <div>32&deg;</div>
      </div>
      <div class="day-card">
        <img src="icons/cloud.svg" class="weather-icon" />
        <div class="day-card-day">Sunday</div>
        <div>32&deg;</div>
      </div>
    </section>

    <table class="hour-section">
      <tbody data-hour-section>
        <tr class="hour-row">
          <td>
            <div class="info-group">
              <div class="label">Thursday</div>
              <div>3 PM</div>
            </div>
          </td>
          <td>
            <img src="icons/cloud.svg" class="weather-icon" />
          </td>
          <td>
            <div class="info-group">
              <div class="label">Temp</div>
              <div>31&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">FL Temp</div>
              <div>25&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">Wind</div>
              <div>26<span class="value-sub-info">mph</span></div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">Precip</div>
              <div>0<span class="value-sub-info">in</span></div>
            </div>
          </td>
        </tr>
        <tr class="hour-row">
          <td>
            <div class="info-group">
              <div class="label">Thursday</div>
              <div>4 PM</div>
            </div>
          </td>
          <td>
            <img src="icons/cloud.svg" class="weather-icon" />
          </td>
          <td>
            <div class="info-group">
              <div class="label">Temp</div>
              <div>31&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">FL Temp</div>
              <div>25&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">Wind</div>
              <div>26<span class="value-sub-info">mph</span></div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">Precip</div>
              <div>0<span class="value-sub-info">in</span></div>
            </div>
          </td>
        </tr>
        <tr class="hour-row">
          <td>
            <div class="info-group">
              <div class="label">Thursday</div>
              <div>5 PM</div>
            </div>
          </td>
          <td>
            <img src="icons/cloud.svg" class="weather-icon" />
          </td>
          <td>
            <div class="info-group">
              <div class="label">Temp</div>
              <div>31&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">FL Temp</div>
              <div>25&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">Wind</div>
              <div>26<span class="value-sub-info">mph</span></div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">Precip</div>
              <div>0<span class="value-sub-info">in</span></div>
            </div>
          </td>
        </tr>
        <tr class="hour-row">
          <td>
            <div class="info-group">
              <div class="label">Thursday</div>
              <div>6 PM</div>
            </div>
          </td>
          <td>
            <img src="icons/cloud.svg" class="weather-icon" />
          </td>
          <td>
            <div class="info-group">
              <div class="label">Temp</div>
              <div>31&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">FL Temp</div>
              <div>25&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">Wind</div>
              <div>26<span class="value-sub-info">mph</span></div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">Precip</div>
              <div>0<span class="value-sub-info">in</span></div>
            </div>
          </td>
        </tr>
        <tr class="hour-row">
          <td>
            <div class="info-group">
              <div class="label">Thursday</div>
              <div>7 PM</div>
            </div>
          </td>
          <td>
            <img src="icons/cloud.svg" class="weather-icon" />
          </td>
          <td>
            <div class="info-group">
              <div class="label">Temp</div>
              <div>31&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">FL Temp</div>
              <div>25&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">Wind</div>
              <div>26<span class="value-sub-info">mph</span></div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">Precip</div>
              <div>0<span class="value-sub-info">in</span></div>
            </div>
          </td>
        </tr>
        <tr class="hour-row">
          <td>
            <div class="info-group">
              <div class="label">Thursday</div>
              <div>8 PM</div>
            </div>
          </td>
          <td>
            <img src="icons/cloud.svg" class="weather-icon" />
          </td>
          <td>
            <div class="info-group">
              <div class="label">Temp</div>
              <div>31&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">FL Temp</div>
              <div>25&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">Wind</div>
              <div>26<span class="value-sub-info">mph</span></div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">Precip</div>
              <div>0<span class="value-sub-info">in</span></div>
            </div>
          </td>
        </tr>
        <tr class="hour-row">
          <td>
            <div class="info-group">
              <div class="label">Thursday</div>
              <div>9 PM</div>
            </div>
          </td>
          <td>
            <img src="icons/cloud.svg" class="weather-icon" />
          </td>
          <td>
            <div class="info-group">
              <div class="label">Temp</div>
              <div>31&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">FL Temp</div>
              <div>25&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">Wind</div>
              <div>26<span class="value-sub-info">mph</span></div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">Precip</div>
              <div>0<span class="value-sub-info">in</span></div>
            </div>
          </td>
        </tr>
        <tr class="hour-row">
          <td>
            <div class="info-group">
              <div class="label">Thursday</div>
              <div>10 PM</div>
            </div>
          </td>
          <td>
            <img src="icons/cloud.svg" class="weather-icon" />
          </td>
          <td>
            <div class="info-group">
              <div class="label">Temp</div>
              <div>31&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">FL Temp</div>
              <div>25&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">Wind</div>
              <div>26<span class="value-sub-info">mph</span></div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">Precip</div>
              <div>0<span class="value-sub-info">in</span></div>
            </div>
          </td>
        </tr>
        <tr class="hour-row">
          <td>
            <div class="info-group">
              <div class="label">Thursday</div>
              <div>11 PM</div>
            </div>
          </td>
          <td>
            <img src="icons/cloud.svg" class="weather-icon" />
          </td>
          <td>
            <div class="info-group">
              <div class="label">Temp</div>
              <div>31&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">FL Temp</div>
              <div>25&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">Wind</div>
              <div>26<span class="value-sub-info">mph</span></div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">Precip</div>
              <div>0<span class="value-sub-info">in</span></div>
            </div>
          </td>
        </tr>
        <tr class="hour-row">
          <td>
            <div class="info-group">
              <div class="label">Thursday</div>
              <div>12 AM</div>
            </div>
          </td>
          <td>
            <img src="icons/cloud.svg" class="weather-icon" />
          </td>
          <td>
            <div class="info-group">
              <div class="label">Temp</div>
              <div>31&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">FL Temp</div>
              <div>25&deg;</div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">Wind</div>
              <div>26<span class="value-sub-info">mph</span></div>
            </div>
          </td>
          <td>
            <div class="info-group">
              <div class="label">Precip</div>
              <div>0<span class="value-sub-info">in</span></div>
            </div>
          </td>
        </tr>
      </tbody>
    </table></>}
      {!loading && (
        <React.Fragment>
          {renderCurrentWeather()}
          <section className="day-section" data-day-section>
            {renderDailyWeather()}
          </section>
          <table className="hour-section">
            <tbody data-hour-section>{renderHourlyWeather()}</tbody>
          </table>
        </React.Fragment>
      )}
    </div>
  );
}
