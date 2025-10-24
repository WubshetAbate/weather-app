import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import styles from "./WeatherCard.module.css";

export default function WeatherCard({
  weather,
  unit = "metric",
  onAddFavorite,
}) {
  const { name, main, weather: details, wind, sys, coord } = weather;

  const flagUrl = `https://flagcdn.com/w40/${sys.country.toLowerCase()}.png`;

  const icon = new L.Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const tempUnit = unit === "metric" ? "°C" : "°F";

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.city}>
          {name}, {sys.country}
        </h2>
        <img src={flagUrl} alt={sys.country} className={styles.flag} />
      </div>

      <img
        src={`https://openweathermap.org/img/wn/${details[0].icon}@2x.png`}
        alt={details[0].description}
        className={styles.icon}
      />

      <p className={styles.temp}>
        {Math.round(main.temp)}
        {tempUnit}
      </p>
      <p className={styles.desc}>{details[0].description}</p>
      <p className={styles.info}>Humidity: {main.humidity}%</p>
      <p className={styles.info}>
        Wind: {wind.speed} {unit === "metric" ? "m/s" : "mph"}
      </p>

      <button
        className={styles.button}
        onClick={() =>
          onAddFavorite && onAddFavorite(`${name}, ${sys.country}`)
        }
      >
        Add to Favorites
      </button>

      <div className={styles.mapContainer}>
        <MapContainer
          center={[coord.lat, coord.lon]}
          zoom={10}
          scrollWheelZoom={false}
          className={styles.map}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker position={[coord.lat, coord.lon]} icon={icon}>
            <Popup>
              {name}, {sys.country}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
