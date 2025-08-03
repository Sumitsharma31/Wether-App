import React, { useState, useEffect } from "react";
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

// --- Helper Components ---

// A simple component for the loading spinner
const Loader = () => (
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
);

// A component to display error messages
const ErrorMessage = ({ message }) => (
  <motion.div
    key="error"
    className="text-center text-yellow-200 bg-yellow-900/50 p-4 rounded-lg"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
  >
    {message}
  </motion.div>
);

// --- Main App Component ---
const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("");

  // --- API Fetching Logic ---

  // Fetches weather and forecast data from the API
  const fetchWeatherData = async (lat, lon, cityName) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch both current weather and forecast in parallel
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`
        ),
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
        ),
      ]);

      if (!weatherRes.ok || !forecastRes.ok) {
        throw new Error("Network response was not ok");
      }

      const weatherJson = await weatherRes.json();
      const forecastJson = await forecastRes.json();

      // FIX: Use forecastJson.timezone as it's guaranteed to exist.
      // Add safety checks for parsing the timezone string.
      let displayName = cityName;
      if (!displayName && forecastJson.timezone) {
        const timezoneParts = forecastJson.timezone.split("/");
        displayName = (timezoneParts[1] || timezoneParts[0]).replace(/_/g, " ");
      }

      setWeatherData({ ...weatherJson, name: displayName || "Weather" });
      setForecast(forecastJson);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Gets coordinates for a city name, then fetches weather
  const fetchWeatherByCity = async (cityName) => {
    if (!cityName) return;
    setLoading(true);
    setError(null);
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`
      );
      if (!geoRes.ok) throw new Error("Geocoding fetch failed");

      const geoJson = await geoRes.json();
      if (geoJson.results && geoJson.results.length > 0) {
        const { latitude, longitude, name } = geoJson.results[0];
        fetchWeatherData(latitude, longitude, name);
      } else {
        setError(`Could not find weather for "${cityName}".`);
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to fetch location data.");
      console.error("Geocoding Error:", err);
      setLoading(false);
    }
  };

  // --- Initial Load Logic ---

  // This useEffect hook runs only once when the app starts
  useEffect(() => {
    const handleInitialLoad = () => {
      // Success callback: runs if the user allows location access
      const onLocationSuccess = (position) => {
        fetchWeatherData(position.coords.latitude, position.coords.longitude);
      };

      // Error callback: runs if user denies access or an error occurs
      const onLocationError = (err) => {
        console.warn(`Geolocation Error: ${err.message}. Defaulting to Patna.`);
        fetchWeatherByCity("Patna");
      };

      // Check if Geolocation API is available in the browser
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          onLocationSuccess,
          onLocationError
        );
      } else {
        // If not available, fetch weather for Patna immediately
        console.warn(
          "Geolocation is not supported by this browser. Defaulting to Patna."
        );
        fetchWeatherByCity("Patna");
      }
    };

    handleInitialLoad();
  }, []); // Empty dependency array ensures this runs only once

  // --- Event Handlers & Render Logic ---

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherByCity(city);
  };

  const getWeatherIcon = (weatherCode) => {
    if (weatherCode === 0) return <Sun size={80} className="text-yellow-400" />;
    if (weatherCode >= 1 && weatherCode <= 3)
      return <Cloud size={80} className="text-gray-400" />;
    if (weatherCode >= 51 && weatherCode <= 67)
      return <CloudRain size={80} className="text-blue-400" />;
    if (weatherCode >= 71 && weatherCode <= 86)
      return <CloudSnow size={80} className="text-white" />;
    return <Cloud size={80} className="text-gray-400" />;
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

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

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {loading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : weatherData && forecast ? (
            <motion.div key="weather-data" variants={containerVariants}>
              {/* Current Weather Details */}
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
                  <p className="text-xl">
                    {weatherData.current_weather.weathercode}
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

              {/* 5-Day Forecast */}
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
                        {Math.round(forecast.daily.temperature_2m_max[index])}°
                      </p>
                      <p className="text-sm opacity-70">
                        {Math.round(forecast.daily.temperature_2m_min[index])}°
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <p className="flex flex-col items-center mt-3">@sumitSharma</p>
      </motion.div>
    </div>
  );
};

export default App;
