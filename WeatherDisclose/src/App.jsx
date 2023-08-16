import React, { useEffect, useState, useRef } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import "./assets/css/style.css";
import { fetchWeather, url } from "./js/api";
import ErrorContent from "./components/404";

function MainBody({
  weather,
  countryDetail,
  unit,
  aqi,
  units,
  hourlyForecasts,
}) {
  return (
    <>
      <Header />
      <Main
        weather={weather}
        countryDetail={countryDetail}
        unit={unit}
        units={units}
        aqi={aqi}
        hourlyForecast={hourlyForecasts}
      />
      <ErrorContent />
    </>
  );
}

function App() {
  const [weather, setWeather] = useState("");
  const [countryDetail, setCountryDetail] = useState("");
  const [aqi, setaqi] = useState("");
  const [forecast, setforecast] = useState("");
  const [unit, setUnit] = useState("metric");
  const lastUnitRef = useRef("metric"); // Use useRef to store the last used unit

  const fetchWeatherData = async (latitude, longitude) => {
    const container = document.querySelector("[data-container]");
    const loading = document.querySelector("[data-loading]");
    const currentLocationBtn = document.querySelector(
      "[data-current-location-btn]"
    );
    const errorContent = document.querySelector("[data-error-content]");

    loading.style.display = "grid";
    container.style.overflowY = "hidden";
    container.classList.remove("fade-in");
    errorContent.style.display = "none";

    if (window.location.hash === "#/current-location") {
      currentLocationBtn.setAttribute("disabled", "");
    } else {
      currentLocationBtn.removeAttribute("disabled");
    }

    try {
      const weatherData = await fetchWeather(
        url.currentWeather(latitude, longitude, lastUnitRef.current) // Use lastUnitRef.current instead of unit
      );
      const detail = await fetchWeather(url.reverseGeo(latitude, longitude));
      const aqiData = await fetchWeather(url.airPollution(latitude, longitude));
      const hourForecasts = await fetchWeather(
        url.forecast(latitude, longitude, lastUnitRef.current)
      );
      setWeather(weatherData);
      setCountryDetail(detail);
      setaqi(aqiData.list);
      setforecast(hourForecasts);
      loading.style.display = "none";
      container.style.overflowY = "overlay";
      container.classList.add("fade-in");
      errorContent.style.display = "none";
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  useEffect(() => {
    let called = false;
    const defaultLocation = "#/weather?lat=51.5073219&lon=-0.1276474";

    const container = document.querySelector("[data-container]");
    const loading = document.querySelector("[data-loading]");
    const errorContent = document.querySelector("[data-error-content]");

    loading.style.display = "grid";
    container.style.overflowY = "hidden";
    container.classList.remove("fade-in");
    errorContent.style.display = "none";

    const currentLocation = () => {
      window.navigator.geolocation.getCurrentPosition(
        async (res) => {
          const { latitude, longitude } = res.coords;
          await timeout(10);

          if (!called) {
            fetchWeatherData(`lat=${latitude}`, `lon=${longitude}`);
          }
        },
        (err) => {
          window.location.hash = defaultLocation;
        }
      );
    };

    const searchedLocation = async (query) => {
      await timeout(100);
      const [lat, lon] = query.split("&");
      if (!called) {
        fetchWeatherData(lat, lon);
      }
    };

    const routes = new Map([
      ["/current-location", currentLocation],
      ["/weather", searchedLocation],
    ]);

    const checkHash = () => {
      const requestUrl = window.location.hash.slice(1);

      const [route, query] = requestUrl.includes("?")
        ? requestUrl.split("?")
        : [requestUrl];

      routes.get(route)
        ? routes.get(route)(query)
        : (errorContent.style.display = "flex");
    };

    window.addEventListener("hashchange", checkHash);

    if (!window.location.hash) {
      window.location.hash = "/current-location";
    }

    // Call checkHash initially, but skip the fetch when unit changes
    if (unit === "metric" || unit === "imperial") {
      if (lastUnitRef.current !== unit) {
        lastUnitRef.current = unit; // Update the last used unit
      }
      checkHash();
    }

    return () => {
      called = true;
    };
  }, [unit]);

  return (
    <MainBody
      weather={weather}
      countryDetail={countryDetail}
      unit={setUnit}
      aqi={aqi}
      units={unit}
      hourlyForecasts={forecast}
    />
  );
}

export default App;
