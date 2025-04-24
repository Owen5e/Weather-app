import React, { useState, useEffect } from "react";
import { WeatherService } from "./services/WeatherService";
import LoadingSpinner from "./components/LoadingSpinner";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import Logo from "./Assets/logoblack.png";

function App() {
  const [city, setCity] = useState("London");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [weather, forecast] = await Promise.all([
        WeatherService.getCurrentWeather(city),
        WeatherService.getForecast(city),
      ]);
      setWeatherData(weather);
      setForecastData(forecast);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeatherData();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#2193b0] to-[#6dd5ed] py-auto px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex align-center justify-center">
          <img src={Logo} alt="Logo" className="w-20 pt-1" />
          <h1 className="my-auto text-4xl font-bold text-gray-800">
            Weather App
          </h1>
        </div>

        <div className="text-center text-sm text-gray-600 mb-4">
          Enter a city name (e.g., Lagos, Abuja, Benin)
        </div>

        <form onSubmit={handleSubmit} className="flex justify-center gap-4">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </form>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-8">
            <div className="flex justify-center">
              <WeatherCard weatherData={weatherData} />
            </div>
            <ForecastCard forecastData={forecastData} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
