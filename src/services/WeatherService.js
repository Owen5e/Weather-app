const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.weatherapi.com/v1";

console.log("API Key:", API_KEY);

export const WeatherService = {
  async getCurrentWeather(city) {
    try {
      const response = await fetch(
        `${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=no`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message ||
            "City not found. Please check the city name and try again."
        );
      }
      const data = await response.json();
      if (!data.location || !data.current) {
        throw new Error("Invalid weather data format received");
      }
      return data;
    } catch (error) {
      console.error("Weather error:", error);
      throw new Error(
        error.message || "Failed to fetch weather data. Please try again later."
      );
    }
  },

  async getForecast(city) {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=no&alerts=no`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Forecast data not found");
      }
      const data = await response.json();
      if (!data.forecast || !Array.isArray(data.forecast.forecastday)) {
        throw new Error("Invalid forecast data format");
      }
      return data;
    } catch (error) {
      console.error("Forecast error:", error);
      throw new Error(error.message || "Failed to fetch forecast data");
    }
  },
};
