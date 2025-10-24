import styles from "./Favorites.module.css";

export default function Favorites({ favorites, onSelect, onRemove }) {
  return (
    <div className={styles.favoritesContainer}>
      <h3>Favorites</h3>
      <ul className={styles.favoritesList}>
        {favorites.map((city) => (
          <li key={city} className={styles.favItem}>
            <span onClick={() => onSelect(city)}>{city}</span>
            <button className={styles.removeBtn} onClick={() => onRemove(city)}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
