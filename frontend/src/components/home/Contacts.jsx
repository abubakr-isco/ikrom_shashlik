import { Clock, ExternalLink, Info, MapPin, MessageCircle, Phone } from 'lucide-react';
import { site } from '../../config/site.js';
import { useI18n } from '../../i18n/context.js';
import { InstagramIcon, TelegramIcon } from '../ui/BrandIcons.jsx';
import { ContactLink } from '../ui/ContactLink.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import styles from './Contacts.module.css';
import { OpenStatus } from './OpenStatus.jsx';

function mapUrls({ lat, lng, zoom }) {
  const dLng = 0.008;
  const dLat = 0.004;
  const bbox = [lng - dLng, lat - dLat, lng + dLng, lat + dLat].map((n) => n.toFixed(5)).join(',');
  return {
    embed: `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`,
    open: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`,
  };
}

export function Contacts() {
  const { t, pick } = useI18n();
  const { phone, socials, hours } = site;
  const map = mapUrls(site.map);

  return (
    <section id="contacts" className={`section ${styles.section}`} aria-labelledby="contacts-title">
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.info}>
          <h2 id="contacts-title" className="section-title">
            {t('contacts.title')}
          </h2>

          <dl className={styles.list}>
            <div className={styles.row}>
              <dt>
                <MapPin size={20} aria-hidden="true" />
                {t('contacts.address')}
              </dt>
              <dd>{pick(site.address)}</dd>
            </div>
            <div className={styles.row}>
              <dt>
                <Phone size={20} aria-hidden="true" />
                {t('contacts.phone')}
              </dt>
              <dd>
                <ContactLink href={phone.href ? `tel:${phone.href}` : ''} className={styles.value}>
                  {phone.display}
                </ContactLink>
              </dd>
            </div>
            <div className={styles.row}>
              <dt>
                <Clock size={20} aria-hidden="true" />
                {t('contacts.hours')}
              </dt>
              <dd>
                {t('contacts.daily', { open: hours.open, close: hours.close })}
                <OpenStatus className={styles.status} />
              </dd>
            </div>
            <div className={styles.row}>
              <dt>
                <MessageCircle size={20} aria-hidden="true" />
                {t('contacts.socials')}
              </dt>
              <dd className={styles.socials}>
                <ContactLink href={socials.telegram.href} external className={styles.social}>
                  <TelegramIcon size={18} />
                  Telegram <span className={styles.handle}>{socials.telegram.label}</span>
                </ContactLink>
                <ContactLink href={socials.instagram.href} external className={styles.social}>
                  <InstagramIcon size={18} />
                  Instagram <span className={styles.handle}>{socials.instagram.label}</span>
                </ContactLink>
              </dd>
            </div>
          </dl>

          {site.isDemo && (
            <p className={styles.demo}>
              <Info size={16} aria-hidden="true" />
              {t('contacts.demoNote')}
            </p>
          )}
        </Reveal>

        <Reveal className={styles.mapWrap} y={28}>
          <iframe
            className={styles.map}
            title={t('contacts.mapTitle')}
            src={map.embed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a className={`btn btn-outline btn-sm ${styles.mapLink}`} href={map.open} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} aria-hidden="true" />
            {t('contacts.openInMaps')}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
