import { Link } from 'react-router';
import styles from './Logo.module.css';

/** Skewer mark: a ring handle, a steel rod and three pieces of meat. */
export function LogoMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="25.5" r="3.6" stroke="#c9c1b6" strokeWidth="2" />
      <path d="M9.2 22.8 29 3" stroke="#c9c1b6" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="10.4" y="16.1" width="6" height="5" rx="1.6" transform="rotate(-45 13.4 18.6)" fill="#f26b1f" />
      <rect x="15" y="11.5" width="6" height="5" rx="1.6" transform="rotate(-45 18 14)" fill="#ff8a3d" />
      <rect x="19.6" y="6.9" width="6" height="5" rx="1.6" transform="rotate(-45 22.6 9.4)" fill="#f26b1f" />
    </svg>
  );
}

export function Logo({ onClick }) {
  return (
    <Link to="/" className={styles.logo} onClick={onClick} aria-label="Ikrom Shashlik">
      <LogoMark />
      <span className={styles.word} aria-hidden="true">
        <span className={styles.first}>IKROM</span>
        <span className={styles.second}>SHASHLIK</span>
      </span>
    </Link>
  );
}
