import React, { useEffect, useRef } from "react";

import Footer from "./Footer";
import { aqiText, getHours, getTime, mps_to_kmh } from "../js/module";

function CardItemForAqi({ aqiData, extraData }) {
  return (
    <li className="card-item">
      <p className="title-1">{aqiData.toPrecision(3)}</p>
      {extraData.length > 1 ? (
        <p className="label-1">
          {extraData[0]}
          <sub className="aqi">{extraData[1]}</sub>
        </p>
      ) : (
        <p className="label-1">
          PM<sub className="aqi">2.5</sub>
        </p>
      )}
    </li>
  );
}

function CardList({ aqi }) {
  return (
    <>
      <h3 className="title-3">Air Quality Index</h3>
      <div className="wrapper">
        <span className="m-icon">air</span>
        {aqi && (
          <ul className="card-list">
            <CardItemForAqi aqiData={aqi[0].components.pm2_5} extraData={[]} />
            <CardItemForAqi
              aqiData={aqi[0].components.so2}
              extraData={["SO", 2]}
            />
            <CardItemForAqi
              aqiData={aqi[0].components.no2}
              extraData={["NO", 2]}
            />
            <CardItemForAqi
              aqiData={aqi[0].components.o3}
              extraData={["O", 3]}
            />
          </ul>
        )}
      </div>
    </>
  );
}

function SunriseAndSunset({ sunrise, sunset, timezone }) {
  return (
    <>
      <h3 className="title-3">Sunrise & Sunset</h3>
      <div className="card-list">
        <div className="card-item">
          <span className="m-icon">clear_day</span>
          <div>
            <p className="label-1">Sunrise</p>
            <p className="title-1">{getTime(sunrise, timezone)}</p>
          </div>
        </div>
        <div className="card-item">
          <span className="m-icon">clear_night</span>
          <div>
            <p className="label-1">Sunset</p>
            <p className="title-1">{getTime(sunset, timezone)}</p>
          </div>
        </div>
      </div>
    </>
  );
}
function Weather({ title, icon, data }) {
  return (
    <div className="card card-sm highlights-card">
      <h3 className="title-3">{title}</h3>
      <div className="wrapper">
        <span className="m-icon"> {icon}</span>
        <p className="title-1">
          {data[0]}
          {data[1] === "C" || data[1] === "F" ? (
            <sup>{data[1]}</sup>
          ) : (
            <sub>{data[1]}</sub>
          )}
        </p>
      </div>
    </div>
  );
}

function HighlightsList({ weather, aqi, unit }) {
  return (
    <div className="highlights-list">
      <div className="card card-sm highlights-card one">
        <CardList aqi={aqi} />
        {aqi && (
          <span
            className={`badge aqi-${aqi[0].main.aqi} label-${aqi[0].main.aqi}`}
            title={aqiText[aqi[0].main.aqi].message}
          >
            {aqiText[aqi[0].main.aqi].level}
          </span>
        )}
      </div>
      <div className="card card-sm highlights-card two">
        {aqi && (
          <SunriseAndSunset
            sunrise={weather.sys.sunrise}
            sunset={weather.sys.sunset}
            timezone={weather.timezone}
          />
        )}
      </div>
      {aqi && (
        <>
          <Weather
            title="Humidity"
            icon="humidity_percentage"
            data={[weather.main.humidity, "%"]}
          />
          <Weather
            title="Pressure"
            icon="airwave"
            data={[weather.main.pressure, "pha"]}
          />
          <Weather
            title="Visibility"
            icon="visibility"
            data={
              unit === "imperial"
                ? [Math.floor(weather.visibility / 1000 / 1.609) + ".0", "mile"]
                : [weather.visibility / 1000 + ".0", "km"]
            }
          />
          <Weather
            title="Feels Like"
            icon="thermostat"
            data={
              unit === "imperial"
                ? [Math.floor(weather.main.feels_like) + "°", "F"]
                : [Math.floor(weather.main.feels_like) + "°", "C"]
            }
          />
        </>
      )}
    </div>
  );
}

function Highlights({ weather, aqi, unit }) {
  return (
    <section
      className="section highlights"
      aria-labelledby="highlights-label"
      data-highlights
    >
      <div className="card card-lg">
        <h2 className="title-2" id="highlights-label">
          Todays Highlights
        </h2>
        <HighlightsList weather={weather} aqi={aqi} unit={unit} />
      </div>
    </section>
  );
}

function SliderItem({ time, iconUrl, temp, description, degree, extra }) {
  return (
    <li className="slider-item">
      <div className="card card-sm slider-card">
        <p className="body-3">{time}</p>
        <img
          src={`/images/weather_icons/${iconUrl}.png`}
          alt={description}
          className="weather-icon"
          width="48"
          height="48"
          loading="lazy"
          style={{ transform: `rotate(${degree - 180}deg)` }}
        />
        {typeof temp === "string" ? (
          <p className="body-3">{Math.floor(Number(temp))}°</p>
        ) : (
          <p className="body-3">
            {Math.round(temp)}
            {" " + extra}
          </p>
        )}
      </div>
    </li>
  );
}

function SliderList({ list, dataType, weather, unit }) {
  const myElementRef = useRef(null);

  useEffect(() => {
    // Access the DOM element using the ref
    const ul = myElementRef.current;

    // Set the data attribute using setAttribute method
    ul.setAttribute(dataType, "");
  }, []);

  return (
    <ul className="slider-list" ref={myElementRef}>
      {dataType === "data-temp" && list
        ? list.slice(0, 7).map((item, index) => {
            let temp = item.main.temp;

            return (
              <SliderItem
                key={index}
                time={getHours(item.dt, weather.timezone)}
                iconUrl={item.weather[0].icon}
                temp={temp.toString()}
                description={item.weather[0].description}
              />
            ); // Add a 'key' prop
          })
        : list.slice(0, 7).map((item, index) => {
            return (
              <SliderItem
                key={index}
                time={getHours(item.dt, weather.timezone)}
                iconUrl={"direction"}
                temp={
                  unit === "imperial"
                    ? Math.round(item.wind.speed)
                    : mps_to_kmh(item.wind.speed)
                }
                extra={unit === "imperial" ? "Mph" : "Kmh"}
                degree={item.wind.deg}
              />
            );
          })}
    </ul>
  );
}

function HourlyForecast({ forecast, weather, unit }) {
  return (
    <section
      className="section hourly-forecast"
      aria-label="hourly forecast"
      data-hourly-forecast
    >
      <h2 className="title-2">Today at</h2>
      {forecast.list && (
        <div className="slider-container">
          <SliderList
            list={forecast ? forecast.list : ""}
            dataType={"data-temp"}
            weather={weather}
          />
          <SliderList
            list={forecast ? forecast.list : ""}
            dataType={"data-wind"}
            weather={weather}
            unit={unit}
          />
        </div>
      )}
    </section>
  );
}

function ContentRight({ weather, aqi, unit, hourlyForecast }) {
  return (
    <div className="content-right">
      <Highlights weather={weather} aqi={aqi} unit={unit} />
      <HourlyForecast forecast={hourlyForecast} weather={weather} unit={unit} />
      <Footer />
    </div>
  );
}

export default ContentRight;
