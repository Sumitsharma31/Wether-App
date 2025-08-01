import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Droplet,
  Search,
  MapPin,
} from "lucide-react";

// Main App Component
const App = () => {
  // State management
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("");
  const [forecast, setForecast] = useState(null);

  // Fetch weather data from the Open-Meteo API
  const fetchWeather = async (
    latitude,
    longitude,
    cityName = null,
    isInitialLoad = false
  ) => {
    setLoading(true);
    setError(null);
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`
      );
      if (!weatherRes.ok) throw new Error("Weather data fetch failed");
      const weatherJson = await weatherRes.json();

      const forecastRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      if (!forecastRes.ok) throw new Error("Forecast data fetch failed");
      const forecastJson = await forecastRes.json();

      setWeatherData({
        ...weatherJson,
        name: cityName || weatherJson.timezone.split("/")[1].replace("_", " "),
      });
      setForecast(forecastJson);
    } catch (err) {
      // Updated error handling: Show a more helpful message on initial load failure.
      if (isInitialLoad) {
        setError("Could not fetch weather. Please search for a city.");
      } else {
        setError("Failed to fetch weather data. Please try again.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather by city name using Geocoding API
  const fetchWeatherByCity = async (cityName, isInitialLoad = false) => {
    if (!cityName) return;
    setLoading(true);
    setError(null);
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`
      );
      if (!geoRes.ok) throw new Error("Geocoding data fetch failed");
      const geoJson = await geoRes.json();
      if (geoJson.results && geoJson.results.length > 0) {
        const { latitude, longitude, name } = geoJson.results[0];
        // Pass the isInitialLoad flag along
        fetchWeather(latitude, longitude, name, isInitialLoad);
      } else {
        setError(`Could not find weather for "${cityName}".`);
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to fetch location data.");
      console.error(err);
      setLoading(false);
    }
  };

  // Get user's location on initial load, with Patna as fallback
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Pass `true` for isInitialLoad on the first automatic fetch
            fetchWeather(
              position.coords.latitude,
              position.coords.longitude,
              null,
              true
            );
          },
          (err) => {
            // If geolocation fails, default to Patna
            console.warn(
              `Geolocation error: ${err.message}. Defaulting to Patna.`
            );
            fetchWeatherByCity("Patna", true);
          }
        );
      } else {
        // If geolocation is not supported, default to Patna
        console.warn("Geolocation is not supported. Defaulting to Patna.");
        fetchWeatherByCity("Patna", true);
      }
    };
    getLocation();
  }, []);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    // Pass false for isInitialLoad on manual searches
    fetchWeatherByCity(city, false);
  };

  // Weather icon mapping
  const getWeatherIcon = (weatherCode) => {
    if (weatherCode === 0) return <Sun size={80} className="text-yellow-400" />;
    if (weatherCode > 0 && weatherCode < 4)
      return <Cloud size={80} className="text-gray-400" />;
    if (weatherCode > 50 && weatherCode < 68)
      return <CloudRain size={80} className="text-blue-400" />;
    if (weatherCode > 70 && weatherCode < 87)
      return <CloudSnow size={80} className="text-white" />;
    return <Cloud size={80} className="text-gray-400" />;
  };

  // Main container animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  // Child item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center p-4 font-sans">
      <motion.div
        className="w-full max-w-4xl bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 text-white"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          className="flex gap-2 mb-6"
          variants={itemVariants}
        >
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search for a city..."
            className="flex-grow p-3 bg-white/30 rounded-lg placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            className="p-3 bg-white/30 rounded-lg hover:bg-white/40 transition-colors"
          >
            <Search size={24} />
          </button>
        </motion.form>

        <AnimatePresence>
          {loading && (
            <motion.div
              key="loader"
              className="flex justify-center items-center h-64"
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-16 h-16 border-4 border-t-transparent border-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          )}
          {error && (
            <motion.div
              key="error"
              className="text-center text-yellow-200 bg-yellow-900/50 p-4 rounded-lg"
              variants={itemVariants}
            >
              {error}
            </motion.div>
          )}
          {weatherData && !loading && !error && (
            <motion.div key="weather-data" variants={containerVariants}>
              {/* Current Weather */}
              <motion.div
                className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8"
                variants={itemVariants}
              >
                <div className="text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-2">
                    <MapPin size={30} /> {weatherData.name}
                  </h1>
                  <p className="text-8xl md:text-9xl font-thin">
                    {Math.round(weatherData.current_weather.temperature)}°
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  {getWeatherIcon(weatherData.current_weather.weathercode)}
                  <p className="text-xl capitalize">
                    {weatherData.current_weather.weathercode.toString()}
                  </p>
                </div>
                <div className="flex flex-col gap-4 text-lg">
                  <div className="flex items-center gap-2">
                    <Wind size={24} /> Wind:{" "}
                    {weatherData.current_weather.windspeed} km/h
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplet size={24} /> Humidity:{" "}
                    {weatherData.hourly.relativehumidity_2m[0]}%
                  </div>
                </div>
              </motion.div>

              {/* Forecast */}
              {forecast && (
                <motion.div variants={itemVariants}>
                  <h2 className="text-2xl font-bold mb-4">5-Day Forecast</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {forecast.daily.time.slice(0, 5).map((day, index) => (
                      <motion.div
                        key={day}
                        className="bg-white/20 p-4 rounded-lg flex flex-col items-center gap-2"
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "rgba(255,255,255,0.3)",
                        }}
                      >
                        <p className="font-semibold">
                          {new Date(day).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </p>
                        {getWeatherIcon(forecast.daily.weathercode[index])}
                        <p className="text-xl font-bold">
                          {Math.round(forecast.daily.temperature_2m_max[index])}
                          °
                        </p>
                        <p className="text-sm opacity-70">
                          {Math.round(forecast.daily.temperature_2m_min[index])}
                          °
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default App;
