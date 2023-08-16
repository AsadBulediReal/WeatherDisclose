import { getDate, monthNames, weekDayNames } from "../js/module";

function CurrentWeatherCard({ weather, countryDetail, unit }) {
  function handleClick(e) {
    if (e.target.innerText === "°C") {
      unit("metric");
    } else if (e.target.innerText === "°F") {
      unit("imperial");
    }
  }
  return (
    <div className="card card-lg current-weather-card">
      <h2 className="title-2 card-title">Now</h2>
      <div className="wrapper">
        <p className="heading">
          {weather.main ? Math.floor(weather.main.temp) : ""}
          <sup className="temp" onClick={handleClick}>
            &deg;C
          </sup>{" "}
          <span className="vertcal-line"></span>
          <sup className="temp" onClick={handleClick}>
            &deg;F
          </sup>
        </p>
        <img
          src={`/images/weather_icons/${
            weather.weather ? weather.weather[0].icon : ""
          }.png`}
          alt={weather.weather ? weather.weather[0].description : ""}
          height="64px"
          width="64px"
          className="weather-icon"
        />
      </div>
      <p className="body-3">
        {weather.weather ? weather.weather[0].description : ""}
      </p>
      <ul className="meta-list">
        <li className="meta-item">
          <span className="m-icon">calendar_today</span>
          <p className="title-3 meta-text">
            {getDate(weather.dt, weather.timezone)}
          </p>
        </li>
        <li className="meta-item">
          <span className="m-icon">location_on</span>
          <p className="title-3 meta-text">
            {countryDetail[0]
              ? countryDetail[0].name + ", " + countryDetail[0].country
              : ""}
          </p>
        </li>
      </ul>
    </div>
  );
}

function CurrentWeather({ weather, countryDetail, unit }) {
  return (
    <section
      className="section current-weather"
      aria-label="current weather"
      data-current-weather
    >
      <CurrentWeatherCard
        weather={weather}
        countryDetail={countryDetail}
        unit={unit}
      />
    </section>
  );
}

function ForecastCardItem({ data }) {
  const date = new Date(data.dt_txt);
  return (
    <li className="card-item">
      <div className="icon-wrapper">
        <img
          src={`/images/weather_icons/${data.weather[0].icon}.png`}
          alt={data.weather[0].description}
          width="36px"
          height="36px"
          className="weather-icon"
          title={data.weather[0].description}
        />
        <span className="span">
          <p className="title-2">{Math.floor(data.main.temp_max)}°</p>
        </span>
      </div>
      <p className="label-1">
        {date.getDate()} {monthNames[date.getMonth()]}
      </p>
      <p className="label-1">{weekDayNames[date.getDay()]}</p>
    </li>
  );
}

function ForecastCard({ forecast }) {
  return (
    <div className="card card-lg forecast-card">
      <ul>
        {forecast &&
          forecast.list
            .filter((_, index) => index >= 7 && (index - 7) % 8 === 0)
            .map((data, index) => <ForecastCardItem key={index} data={data} />)}
      </ul>
    </div>
  );
}

function Forecast({ forecast }) {
  return (
    <section
      className="section forecast"
      aria-labelledby="forecast-label"
      data-5-day-forecast
    >
      <h2 className="title-2" id="forecast-label">
        5 Days Forecast
      </h2>
      <ForecastCard forecast={forecast} />
    </section>
  );
}

function ContentLeft({ weather, countryDetail, unit, forecast }) {
  return (
    <div className="content-left">
      <CurrentWeather
        weather={weather}
        countryDetail={countryDetail}
        unit={unit}
      />
      <Forecast forecast={forecast} />
    </div>
  );
}

export default ContentLeft;
