import React, { useState, useEffect } from "react";
import axios from "axios";
import { ICON_MAP } from "./iconMap";

export function WeatherComponent() {
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

    function parseCurrentWeather({ current_weather, daily }) {
      const {
        temperature: currentTemp,
        windspeed: windSpeed,
        weathercode: iconCode
      } = current_weather

      const {
        temperature_2m_max: [maxTemp],
        temperature_2m_min: [minTemp],
        apparent_temperature_max: [maxFeelsLike],
        apparent_temperature_min: [minFeelsLike],
        precipitation_sum: [precip],
      } = daily

      return {
        currentTemp: Math.round(currentTemp),
        highTemp: Math.round(maxTemp),
        lowTemp: Math.round(minTemp),
        highFeelsLike: Math.round(maxFeelsLike),
        lowFeelsLike: Math.round(minFeelsLike),
        windSpeed: Math.round(windSpeed),
        precip: Math.round(precip * 100) / 100,
        iconCode,
      }
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

  }, []);

  function getIconUrl(iconCode) {
    return `icons/${ICON_MAP.get(iconCode)}.svg`
  }

  function renderCurrentWeather() {
    return(
      <header className="header">
        <div className="header-left">
          <img className="weather-icon large" src="icons/sun.svg" data-current-icon />
          <div className="header-current-temp">
            <span data-current-temp>{current?.currentTemp}</span>&deg;
          </div>
        </div>
        <div className="header-right">
          <div className="info-group">
            <div className="label">High</div>
            <div><span data-current-high>{current?.highTemp}</span>&deg;</div>
          </div>
          <div className="info-group">
            <div className="label">FL High</div>
            <div><span data-current-fl-high>{current?.highFeelsLike}</span>&deg;</div>
          </div>
          <div className="info-group">
            <div className="label">Wind</div>
            <div><span data-current-wind>{current?.windSpeed}</span><span className="value-sub-info">mph</span></div>
          </div>
          <div className="info-group">
            <div className="label">Low</div>
            <div><span data-current-low>{current?.lowTemp}</span>&deg;</div>
          </div>
          <div className="info-group">
            <div className="label">FL Low</div>
            <div><span data-current-fl-low>{current?.lowFeelsLike}</span>&deg;</div>
          </div>
          <div className="info-group">
            <div className="label">Precip</div>
            <div><span data-current-precip>{current?.precip}</span><span className="value-sub-info">in</span></div>
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
          <img src={getIconUrl(hour.iconCode)} className="weather-icon" />
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
    <div>
      {renderCurrentWeather()}
      <section className="day-section" data-day-section>
        {renderDailyWeather()}
      </section>
      <table className="hour-section">
        <tbody data-hour-section>
          {renderHourlyWeather()}
        </tbody>
      </table>
    </div>
  );
}
