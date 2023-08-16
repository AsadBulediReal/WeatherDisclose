/**
 * @license MIT
 * @fileoverview All api related stuff like api_key, api request etc.
 * @copyright Jamil Ahmed Buledi 2023 All rights reserved
 * @author Jamil Ahmed Buledi <buledijamil37@gmail.com>
 */

"use strict";

const weatherApi_key = "7621e60ac7205e6947910d86c20ce1f5";

/**
 * Fetch data from server
 * @param {string} URL API URL
 * @param {Function} callback CALLBACK
 */
export const fetchData = (url, callback) => {
  fetch(`${url}&appid=${weatherApi_key}`)
    .then((res) => res.json())
    .then((data) => callback(data))
    .catch((error) => console.error("Error fetching data:", error)); // Add error handling
};

export const fetchWeather = (url) => {
  return fetch(`${url}&appid=${weatherApi_key}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => data);
};

export const url = {
  currentWeather(lat, lon, unit) {
    return `https://api.openweathermap.org/data/2.5/weather?&${lat}&${lon}&units=${unit}`;
  },

  forecast(lat, lon, unit) {
    return `https://api.openweathermap.org/data/2.5/forecast?&${lat}&${lon}&units=${unit}`;
  },

  airPollution(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/air_pollution?&${lat}&${lon}`;
  },

  reverseGeo(lat, lon) {
    return `https://api.openweathermap.org/geo/1.0/reverse?&${lat}&${lon}`;
  },

  /**
   * Fetch data from server
   * @param {string} query search query e.g: "London"
   */
  geo(query) {
    return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${weatherApi_key}`;
  },
};
