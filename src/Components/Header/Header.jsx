import styles from "./Header.module.css";

export default function Header({ darkMode, setDarkMode }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.headerTitle}>Weather App</h1>
      <button
        className={styles.themeBtn}
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "🌞 Light" : "🌙 Dark"}
      </button>
    </header>
  );
}
