import React from "react";
import PropTypes from "prop-types";
import { Sun, Cloud, CloudRain, Snowflake, CloudLightning, CloudFog, Thermometer, Droplets, Wind, Eye, Star } from "lucide-react";

const WeatherCard = ({ weatherData, darkMode, onAddFavorite, isFavorite }) => {
  if (!weatherData) return <p>Loading weather data...</p>;

  const getWeatherIcon = (condition, size = 24) => {
    const text = condition?.toLowerCase() || "";
    if (text.includes("sunny") || text.includes("clear")) return <Sun size={size} className="text-yellow-400" />;
    if (text.includes("cloud")) return <Cloud size={size} className="text-gray-400" />;
    if (text.includes("rain")) return <CloudRain size={size} className="text-blue-400" />;
    if (text.includes("snow")) return <Snowflake size={size} className="text-blue-200" />;
    if (text.includes("thunder") || text.includes("storm")) return <CloudLightning size={size} className="text-yellow-500" />;
    if (text.includes("fog") || text.includes("mist")) return <CloudFog size={size} className="text-gray-300" />;
    return <Thermometer size={size} className="text-red-400" />;
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-lg max-w-sm w-full transition-colors duration-300 ${
        darkMode ? "bg-gray-700" : "bg-white"
      }`}
    >
      <div className="text-center">
        {/* Location and Favorite */}
        <div className="flex justify-between items-start mb-4">
          <h2
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {weatherData?.location?.name || "N/A"}
          </h2>
          <button
            onClick={onAddFavorite}
            className="text-2xl hover:scale-110 transition-transform"
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? <Star size={24} className="text-yellow-400 fill-yellow-400" /> : <Star size={24} className="text-gray-400" />}
          </button>
        </div>

        {/* Country */}
        <p
          className={`text-sm mb-4 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {weatherData?.location?.country || "N/A"}
        </p>

        {/* Weather Icon and Temperature */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <span>{getWeatherIcon(weatherData?.current?.condition?.text, 64)}</span>
          <div>
            <div className="text-5xl font-bold">
              {weatherData?.current?.temp_c
                ? `${Math.round(weatherData.current.temp_c)}°C`
                : "N/A"}
            </div>
            <div
              className={`text-lg ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {weatherData?.current?.temp_f
                ? `${Math.round(weatherData.current.temp_f)}°F`
                : ""}
            </div>
          </div>
        </div>

        {/* Display weather condition description */}
        <p
          className={`text-xl capitalize mb-4 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {weatherData?.current?.condition?.text || "N/A"}
        </p>

        {/* Display additional weather details */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div
            className={`p-3 rounded-lg ${
              darkMode ? "bg-gray-600" : "bg-gray-50"
            }`}
          >
            <p className="text-gray-500 text-sm flex items-center gap-1"><Droplets size={14} className="text-blue-400" /> Humidity</p>
            <p
              className={`font-bold text-lg ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {weatherData?.current?.humidity || "N/A"}%
            </p>
          </div>
          <div
            className={`p-3 rounded-lg ${
              darkMode ? "bg-gray-600" : "bg-gray-50"
            }`}
          >
            <p className="text-gray-500 text-sm flex items-center gap-1"><Wind size={14} className="text-gray-400" /> Wind</p>
            <p
              className={`font-bold text-lg ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {weatherData?.current?.wind_kph || "N/A"} kph
            </p>
          </div>
          <div
            className={`p-3 rounded-lg ${
              darkMode ? "bg-gray-600" : "bg-gray-50"
            }`}
          >
            <p className="text-gray-500 text-sm flex items-center gap-1"><Eye size={14} className="text-gray-400" /> Visibility</p>
            <p
              className={`font-bold text-lg ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {weatherData?.current?.vis_km || "N/A"} km
            </p>
          </div>
          <div
            className={`p-3 rounded-lg ${
              darkMode ? "bg-gray-600" : "bg-gray-50"
            }`}
          >
            <p className="text-gray-500 text-sm flex items-center gap-1"><Thermometer size={14} className="text-red-400" /> Feels Like</p>
            <p
              className={`font-bold text-lg ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {weatherData?.current?.feelslike_c
                ? `${Math.round(weatherData.current.feelslike_c)}°C`
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Last Updated */}
        <p
          className={`text-xs mt-4 ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          Last updated: {weatherData?.current?.last_updated || "N/A"}
        </p>
      </div>
    </div>
  );
};

WeatherCard.propTypes = {
  weatherData: PropTypes.shape({
    location: PropTypes.shape({
      name: PropTypes.string,
      country: PropTypes.string,
    }),
    current: PropTypes.shape({
      temp_c: PropTypes.number,
      temp_f: PropTypes.number,
      condition: PropTypes.shape({
        text: PropTypes.string,
      }),
      humidity: PropTypes.number,
      wind_kph: PropTypes.number,
      vis_km: PropTypes.number,
      feelslike_c: PropTypes.number,
      last_updated: PropTypes.string,
    }),
  }),
  darkMode: PropTypes.bool,
  onAddFavorite: PropTypes.func,
  isFavorite: PropTypes.bool,
};

export default WeatherCard;
