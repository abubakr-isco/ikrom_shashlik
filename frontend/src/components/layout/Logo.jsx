import { Link } from 'react-router';
import styles from './Logo.module.css';

/**
 * Round Ikrom Shashlik badge. At header size the lettering inside the badge
 * is too small to read, so the name is repeated next to it as text.
 */
export function Logo({ onClick, size = 'md', showName = true }) {
  return (
    <Link to="/" className={styles.logo} data-size={size} onClick={onClick} aria-label="Ikrom Shashlik">
      <img
        className={styles.badge}
        src="/images/brand/logo-160.webp"
        srcSet="/images/brand/logo-160.webp 160w, /images/brand/logo-320.webp 320w"
        sizes={size === 'lg' ? '96px' : '52px'}
        width="160"
        height="160"
        alt=""
        decoding="async"
      />
      {showName && (
        <span className={styles.word} aria-hidden="true">
          <span className={styles.first}>IKROM</span>
          <span className={styles.second}>SHASHLIK</span>
        </span>
      )}
    </Link>
  );
}
