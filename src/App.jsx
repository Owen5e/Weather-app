import React, { useState, useEffect, useRef } from "react";
import { WeatherService } from "./services/WeatherService";
import LoadingSpinner from "./components/LoadingSpinner";
import Logo from "./Assets/logoblack.png";
import { Sun, Moon, Cloud, CloudRain, Snowflake, CloudLightning, CloudFog, Thermometer, Droplets, Wind, Star } from "lucide-react";

function App() {
  const [city, setCity] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [savedLocations, setSavedLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const initialLoaded = useRef(false);

  // Load from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("weatherSearchHistory");
    const savedFavorites = localStorage.getItem("weatherFavorites");
    const savedDarkMode = localStorage.getItem("weatherDarkMode");
    const savedLocations = localStorage.getItem("weatherSavedLocations");
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
    if (savedLocations) {
      setSavedLocations(JSON.parse(savedLocations));
    }
    setInitialLoading(false);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem("weatherFavorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("weatherDarkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("weatherSavedLocations", JSON.stringify(savedLocations));
  }, [savedLocations]);

  const fetchWeatherData = async (cityName) => {
    try {
      setLoading(true);
      setError(null);
      const [weather, forecast] = await Promise.all([
        WeatherService.getCurrentWeather(cityName),
        WeatherService.getForecast(cityName),
      ]);

      const locationData = {
        id: Date.now() + Math.random(),
        city: cityName,
        weather,
        forecast,
        timestamp: new Date().toISOString(),
      };

      // Add to saved locations (avoid duplicates)
      setSavedLocations((prev) => {
        const filtered = prev.filter((loc) => loc.city.toLowerCase() !== cityName.toLowerCase());
        return [locationData, ...filtered];
      });

      // Add to search history
      setSearchHistory((prev) => {
        const updated = [cityName, ...prev.filter((c) => c.toLowerCase() !== cityName.toLowerCase())].slice(0, 10);
        return updated;
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load initial cities
  useEffect(() => {
    const loadInitialCities = async () => {
      if (initialLoaded.current) return;
      if (savedLocations.length > 0) {
        initialLoaded.current = true;
        return;
      }

      const initialCities = ["Lagos", "London", "Amsterdam", "New York"];
      
      for (const city of initialCities) {
        try {
          await fetchWeatherData(city);
        } catch (err) {
          console.error(`Failed to load ${city}:`, err);
        }
      }
      initialLoaded.current = true;
    };

    loadInitialCities();
  }, [savedLocations]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherData(city);
      setCity("");
      setShowHistory(false);
    }
  };

  const handleHistoryClick = (historyCity) => {
    fetchWeatherData(historyCity);
    setShowHistory(false);
  };

  const addToFavorites = (locationName) => {
    if (locationName && !favorites.includes(locationName)) {
      setFavorites([...favorites, locationName]);
    }
  };

  const removeFromFavorites = (favCity) => {
    setFavorites(favorites.filter((f) => f !== favCity));
  };

  const removeLocation = (locationId) => {
    setSavedLocations(savedLocations.filter((loc) => loc.id !== locationId));
  };

  const clearHistory = () => {
    setSearchHistory([]);
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

  // Filter locations for favorites tab
  const favoriteLocations = savedLocations.filter((loc) =>
    favorites.includes(loc.weather?.location?.name)
  );

  // Show loading spinner during initial load
  if (initialLoading) {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center transition-colors duration-300 ${darkMode ? "bg-gradient-to-r from-gray-900 to-gray-700" : "bg-gradient-to-r from-[#2193b0] to-[#6dd5ed]"}`}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full py-auto px-4 transition-colors duration-300 ${darkMode ? "bg-gradient-to-r from-gray-900 to-gray-700" : "bg-gradient-to-r from-[#2193b0] to-[#6dd5ed]"}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex align-center justify-center relative">
          <img src={Logo} alt="Logo" className="w-20 pt-1" />
          <h1 className={`my-auto text-4xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
            Weather App
          </h1>
          <button onClick={() => setDarkMode(!darkMode)} className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full ${darkMode ? "bg-gray-700 text-yellow-400" : "bg-white text-gray-600"}`}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 flex-wrap">
          <button onClick={() => setActiveTab("all")} className={`px-4 py-2 rounded-lg transition-colors ${activeTab === "all" ? "bg-blue-500 text-white" : darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}>
            All Locations
          </button>
          <button onClick={() => setActiveTab("favorites")} className={`px-4 py-2 rounded-lg transition-colors ${activeTab === "favorites" ? "bg-blue-500 text-white" : darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}>
            Favorites
          </button>
        </div>

        {/* Search Section */}
        <div className="relative">
          <div className="text-center text-sm text-gray-600 mb-4 dark:text-gray-300">
            Enter a city name to add it to your locations
          </div>

          <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
            <input ref={inputRef} type="text" value={city} onChange={(e) => { setCity(e.target.value); setShowHistory(true); }} onFocus={() => setShowHistory(true)} placeholder="Enter city name" className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 text-white border-gray-600" : ""}`} />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Add Location
            </button>
          </form>

          {/* Search History Dropdown */}
          {showHistory && searchHistory.length > 0 && (
            <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 rounded-lg shadow-lg z-50 w-full max-w-md ${darkMode ? "bg-gray-700" : "bg-white"}`}>
              <div className="flex justify-between items-center p-2 border-b">
                <span className={`text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Recent Searches</span>
                <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-600">Clear</button>
              </div>
              {searchHistory.map((item, index) => (
                <div key={index} onClick={() => handleHistoryClick(item)} className={`p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Locations Grid */}
        {!loading && (
          <>
            {activeTab === "all" && (
              <div>
                <h2 className={`text-2xl font-bold text-center mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Your Locations ({savedLocations.length})
                </h2>
                {savedLocations.length === 0 ? (
                  <p className={`text-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    No locations yet. Search for a city to add it!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedLocations.map((location) => (
                      <div key={location.id} className={`relative p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl ${darkMode ? "bg-gray-700" : "bg-white"}`}>
                        <button onClick={() => removeLocation(location.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors" title="Remove location">
                          ✕
                        </button>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                              {location.weather?.location?.name || location.city}
                            </h3>
                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              {location.weather?.location?.country}
                            </p>
                          </div>
                          <button onClick={() => addToFavorites(location.weather?.location?.name)} className="text-2xl hover:scale-110 transition-transform" title="Add to favorites">
                            {favorites.includes(location.weather?.location?.name) ? <Star size={24} className="text-yellow-400 fill-yellow-400" /> : <Star size={24} className="text-gray-400" />}
                          </button>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                          <span>{getWeatherIcon(location.weather?.current?.condition?.text, 48)}</span>
                          <div>
                            <div className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                              {location.weather?.current?.temp_c ? `${Math.round(location.weather.current.temp_c)}°C` : "N/A"}
                            </div>
                            <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                              {location.weather?.current?.condition?.text}
                            </div>
                          </div>
                        </div>
                        <div className={`grid grid-cols-2 gap-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                          <div className="flex items-center gap-1"><Droplets size={14} className="text-blue-400" /> Humidity: {location.weather?.current?.humidity}%</div>
                          <div className="flex items-center gap-1"><Wind size={14} className="text-gray-400" /> Wind: {location.weather?.current?.wind_kph} kph</div>
                        </div>
                        <p className={`text-xs mt-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                          Updated: {new Date(location.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "favorites" && (
              <div>
                <h2 className={`text-2xl font-bold text-center mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Your Favorites ({favorites.length})
                </h2>
                {favorites.length === 0 ? (
                  <p className={`text-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    No favorites yet. Star a city to add it here!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteLocations.map((location) => (
                      <div key={location.id} className={`relative p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl ${darkMode ? "bg-gray-700" : "bg-white"}`}>
                        <button onClick={() => removeFromFavorites(location.weather?.location?.name)} className="absolute top-2 right-2 text-yellow-500 hover:text-red-500 transition-colors" title="Remove from favorites">
                          ✕
                        </button>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                              {location.weather?.location?.name || location.city}
                            </h3>
                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              {location.weather?.location?.country}
                            </p>
                          </div>
                          <Star size={24} className="text-yellow-400 fill-yellow-400" />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                          <span>{getWeatherIcon(location.weather?.current?.condition?.text, 48)}</span>
                          <div>
                            <div className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                              {location.weather?.current?.temp_c ? `${Math.round(location.weather.current.temp_c)}°C` : "N/A"}
                            </div>
                            <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                              {location.weather?.current?.condition?.text}
                            </div>
                          </div>
                        </div>
                        <div className={`grid grid-cols-2 gap-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                          <div className="flex items-center gap-1"><Droplets size={14} className="text-blue-400" /> Humidity: {location.weather?.current?.humidity}%</div>
                          <div className="flex items-center gap-1"><Wind size={14} className="text-gray-400" /> Wind: {location.weather?.current?.wind_kph} kph</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
