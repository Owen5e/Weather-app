import React from "react";

const ForecastCard = ({ forecastData }) => {
  if (!forecastData) return null;

  const getDayForecast = () => {
    if (!forecastData.list || !Array.isArray(forecastData.list)) {
      return [];
    }
    const uniqueDays = new Map();
    return forecastData.list.filter((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!uniqueDays.has(date) && uniqueDays.size < 5) {
        uniqueDays.set(date, true);
        return true;
      }
      return false;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
      {getDayForecast().map((day, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
          <p className="font-bold text-center">
            {new Date(day.dt * 1000).toLocaleDateString("en-US", {
              weekday: "short",
            })}
          </p>
          <div className="text-center">
            <p className="text-2xl font-bold">{Math.round(day.main.temp)}°C</p>
            <p className="text-sm capitalize">
              {day.weather?.[0]?.description || "N/A"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForecastCard;
