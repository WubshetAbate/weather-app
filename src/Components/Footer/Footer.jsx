import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.developer}>"Developed by Wubshet Abate"</p>
      <p className={styles.rights}>2025, All Rights Reserved.</p>
      <p className={styles.location}>
        Ethiopia 
      </p>
    </footer>
  );
}
