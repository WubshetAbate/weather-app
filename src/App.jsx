import { useState, useEffect } from "react";
import WeatherCard from "./components/WeatherCard/WeatherCard.jsx";
import Favorites from "./Components/Favorites/Favorites.jSX";
import Header from "./Components/Header/Header.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import styles from "./App.module.css";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [unit, setUnit] = useState("metric");
  const [showFavorites, setShowFavorites] = useState(false);
  const [addedMessage, setAddedMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async (cityName, fetchUnit = unit) => {
    if (!cityName) return;
    try {
      setLoading(true);
      setError("");
      setWeather(null);

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${fetchUnit}&appid=${apiKey}`
      );
      if (!res.ok) throw new Error("City not found or API key invalid");

      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon, fetchUnit = unit) => {
    try {
      setLoading(true);
      setError("");
      setWeather(null);

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${fetchUnit}&appid=${apiKey}`
      );
      if (!res.ok) throw new Error("Location not found or API key invalid");

      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleHomeClick = () => {
    setCity("");
    setWeather(null);
    setError("");
    setShowFavorites(false);
  };

  const toggleUnit = () => {
    const newUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(newUnit);
    if (weather) fetchWeather(weather.name, newUnit);
  };

  const toggleFavorites = () => setShowFavorites((prev) => !prev);

  const handleFavoriteSelect = (cityName) => fetchWeather(cityName);

  const handleAddFavorite = (cityName) => {
    if (!favorites.includes(cityName)) {
      const updated = [...favorites, cityName];
      setFavorites(updated);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setAddedMessage(`${cityName} added!`);
      setTimeout(() => setAddedMessage(""), 2000);
    }
  };

  const handleRemoveFavorite = (cityName) => {
    const updated = favorites.filter((c) => c !== cityName);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const shareWeather = () => {
    if (!weather) return;
    const text = `Weather in ${weather.name}: ${
      weather.weather[0].description
    }, ${Math.round(weather.main.temp)}°`;
    navigator.clipboard.writeText(text);
    alert("Weather copied to clipboard!");
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude, unit),
      () => fetchWeather("New York", unit)
    );
  }, []);

  return (
    <div
      className={`${styles.appWrapper} ${
        darkMode ? styles.dark : styles.light
      }`}
    >
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className={styles.navbar}>
        <span className={styles.navLink} onClick={handleHomeClick}>
          Home
        </span>
        <span className={styles.navLink} onClick={toggleFavorites}>
          {showFavorites ? "Hide Favorites" : "Show Favorites"}
        </span>
      </div>

      <main className={styles.mainContent}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={styles.input}
          />
          <button
            onClick={() => fetchWeather(city)}
            className={styles.button}
            disabled={loading}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        <div className={styles.unitToggle} onClick={toggleUnit}>
          Toggle to {unit === "metric" ? "°F" : "°C"}
        </div>

        {addedMessage && (
          <div className={styles.addedMessage}>{addedMessage}</div>
        )}

        {showFavorites && favorites.length > 0 && (
          <Favorites
            favorites={favorites}
            onSelect={handleFavoriteSelect}
            onRemove={handleRemoveFavorite}
          />
        )}

        {loading && <div className={styles.loader}></div>}
        {error && <p className={styles.error}>{error}</p>}

        {weather && (
          <div className={styles.weatherContainer}>
            <WeatherCard
              weather={weather}
              unit={unit}
              onAddFavorite={handleAddFavorite}
            />
            <button onClick={shareWeather} className={styles.button}>
              Share Weather
            </button>
          </div>
        )}
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
}
