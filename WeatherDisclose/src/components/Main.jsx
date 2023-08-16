import ContentLeft from "./ContentLeft";
import ContentRight from "./ContentRight";

function Container({
  weather,
  countryDetail,
  unit,
  aqi,
  units,
  hourlyForecast,
}) {
  return (
    <article className="container" data-container>
      <ContentLeft
        weather={weather}
        countryDetail={countryDetail}
        unit={unit}
        forecast={hourlyForecast}
      />
      <ContentRight
        weather={weather}
        aqi={aqi}
        unit={units}
        hourlyForecast={hourlyForecast}
      />
      <div className="loading" data-loading></div>
    </article>
  );
}

function Main({ weather, countryDetail, unit, aqi, units, hourlyForecast }) {
  return (
    <main>
      <Container
        weather={weather}
        countryDetail={countryDetail}
        unit={unit}
        units={units}
        aqi={aqi}
        hourlyForecast={hourlyForecast}
      />
    </main>
  );
}

export default Main;
