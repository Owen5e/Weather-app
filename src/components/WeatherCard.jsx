import React from "react";
import PropTypes from "prop-types";

const WeatherCard = ({ weatherData }) => {
  console.log("Weather Data in WeatherCard:", weatherData);

  if (!weatherData) return <p>Loading weather data...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <div className="text-center">
        {/* Display location name */}
        <h2 className="text-2xl font-bold mb-4">
          {weatherData?.location?.name || "N/A"}
        </h2>

        {/* Display temperature */}
        <div className="text-6xl font-bold mb-4">
          {weatherData?.current?.temp_c
            ? `${Math.round(weatherData.current.temp_c)}°C`
            : "N/A"}
        </div>

        {/* Display weather condition description */}
        <p className="text-xl capitalize mb-4">
          {weatherData?.current?.condition?.text || "N/A"}
        </p>

        {/* Display additional weather details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Humidity</p>
            <p className="font-bold">
              {weatherData?.current?.humidity || "N/A"}%
            </p>
          </div>
          <div>
            <p className="text-gray-600">Wind Speed</p>
            <p className="font-bold">
              {weatherData?.current?.wind_kph || "N/A"} kph
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

WeatherCard.propTypes = {
  weatherData: PropTypes.shape({
    location: PropTypes.shape({
      name: PropTypes.string,
    }),
    current: PropTypes.shape({
      temp_c: PropTypes.number,
      condition: PropTypes.shape({
        text: PropTypes.string,
      }),
      humidity: PropTypes.number,
      wind_kph: PropTypes.number,
    }),
  }),
};

export default WeatherCard;
