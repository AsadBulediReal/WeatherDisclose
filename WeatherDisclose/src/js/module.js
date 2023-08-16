/**
 * @license MIT
 * @fileoverview All module functions
 * @copyright Jamil Ahmed Buledi 2023 All rights reserved
 * @author Jamil Ahmed Buledi <buledijamil37@gmail.com>
 */

"use strict";

export const weekDayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * @param {number} dataUnix Unix date in seconds
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Date string. formate: "Sunday 10 Jan"
 */

export const getDate = (dateUnix, timezone) => {
  const date = new Date((dateUnix + timezone) * 1000);
  const weekDayName = weekDayNames[date.getUTCDay()];
  const monthName = monthNames[date.getUTCMonth()];
  return `${weekDayName} ${date.getUTCDate()}, ${monthName}`;
};

/**
 * @param {number} timeUnix Unix date in seconds
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Time string. formate: "HH:MM PM/AM"
 */
export const getTime = (timeUnix, timezone) => {
  const date = new Date((timeUnix + timezone) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const period = hours > 12 ? "pm" : "am";
  return minutes.toString().length <= 1
    ? `${hours % 12 || 12}:0${minutes}${period}`
    : `${hours % 12 || 12}:${minutes}${period}`;
};

/**
 * @param {number} timeUnix Unix date in seconds
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Time string. formate: "HH:MM PM/AM"
 */
export const getHours = (timeUnix, timezone) => {
  const adjustedUnixTime = timeUnix + timezone; // Apply timezone offset
  const date = new Date(adjustedUnixTime * 1000);
  const hours = date.getUTCHours();
  const period = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12} ${period}`;
};

export const mps_to_kmh = (mps) => {
  const kph = mps * 3600;
  return kph / 1000;
};

export const aqiText = {
  1: {
    level: "Good",
    message:
      "Air quality is considered satisfactory, and air pollution poses little or no risk",
  },
  2: {
    level: "Fair",
    message:
      "Air qulity is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who have unusually sensitive to air pollution.",
  },
  3: {
    level: "Moderate",
    message:
      "Member of sensitive groups may experience health effects. The general public is not likely to be affected.",
  },
  4: {
    level: "Poor",
    message:
      "Everyone may begin to experience health effects, members of sensitive groups may experience more serious health effects",
  },
  5: {
    level: "Very Poor",
    message:
      "Health warnings of emergency conditions. the entire popullation is more likely to be affected.",
  },
};

export default {
  weekDayNames,
  monthNames,
  aqiText,
  getDate,
  getTime,
  getHours,
  mps_to_kmh,
};
