import React from "react";
import { Sun, Cloud, CloudRain, Snowflake, CloudLightning, CloudFog, Thermometer, Droplets } from "lucide-react";

const ForecastCard = ({ forecastData, darkMode }) => {
  if (!forecastData) return null;

  // Support both WeatherAPI format and OpenWeatherMap format
  const getForecastDays = () => {
    // WeatherAPI format: forecastData.forecast.forecastday
    if (
      forecastData.forecast &&
      Array.isArray(forecastData.forecast.forecastday)
    ) {
      return forecastData.forecast.forecastday.slice(0, 3);
    }
    // OpenWeatherMap format: forecastData.list
    if (forecastData.list && Array.isArray(forecastData.list)) {
      const uniqueDays = new Map();
      return forecastData.list.filter((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!uniqueDays.has(date) && uniqueDays.size < 3) {
          uniqueDays.set(date, true);
          return true;
        }
        return false;
      });
    }
    return [];
  };

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

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const forecastDays = getForecastDays();

  return (
    <div className="w-full">
      <h2
        className={`text-2xl font-bold text-center mb-6 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        3-Day Forecast
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {forecastDays.map((day, index) => {
          // Handle both data formats
          const date = day.date || new Date(day.dt * 1000).toLocaleDateString();
          const maxTemp = day.day?.maxtemp_c ?? day.main?.temp_max ?? Math.round(day.main?.temp) ?? 0;
          const minTemp = day.day?.mintemp_c ?? day.main?.temp_min ?? Math.round(day.main?.temp) ?? 0;
          const condition = day.day?.condition?.text ?? day.weather?.[0]?.description ?? "N/A";

          return (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-lg transition-colors duration-300 ${
                darkMode ? "bg-gray-700" : "bg-white"
              }`}
            >
              <p
                className={`text-lg font-semibold text-center mb-2 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {getDayName(date)}
              </p>
              <p
                className={`text-center text-sm mb-4 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {new Date(date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <div className="text-center mb-4">
                <span>{getWeatherIcon(condition, 48)}</span>
              </div>

              <div className="flex justify-center gap-4 mb-4">
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    High
                  </p>
                  <p
                    className={`text-xl font-bold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {Math.round(maxTemp)}°C
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Low
                  </p>
                  <p
                    className={`text-xl font-bold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {Math.round(minTemp)}°C
                  </p>
                </div>
              </div>

              <p
                className={`text-center capitalize ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {condition}
              </p>

              {/* Additional info for WeatherAPI format */}
              {day.day?.uv && (
                <div
                  className={`mt-4 pt-4 border-t ${
                    darkMode ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between text-sm">
                    <span
                      className={
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }
                    >
                      <span className="flex items-center gap-1"><Sun size={14} className="text-yellow-400" /> UV Index</span>
                    </span>
                    <span
                      className={
                        darkMode ? "text-white" : "text-gray-800"
                      }
                    >
                      {day.day.uv}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span
                      className={
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }
                    >
                      <span className="flex items-center gap-1"><Droplets size={14} className="text-blue-400" /> Precipitation</span>
                    </span>
                    <span
                      className={
                        darkMode ? "text-white" : "text-gray-800"
                      }
                    >
                      {day.day.totalprecip_mm ?? 0} mm
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastCard;
