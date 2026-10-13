import { About } from '../components/home/About.jsx';
import { Contacts } from '../components/home/Contacts.jsx';
import { Hero } from '../components/home/Hero.jsx';
import { PopularDishes } from '../components/home/PopularDishes.jsx';
import { WhyUs } from '../components/home/WhyUs.jsx';
import { MenuSection } from '../components/menu/MenuSection.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { useI18n } from '../i18n/context.js';

export function HomePage() {
  const { t } = useI18n();
  usePageTitle(t('meta.title'));

  return (
    <main id="main" tabIndex={-1}>
      <Hero />
      <PopularDishes />
      <MenuSection />
      <WhyUs />
      <About />
      <Contacts />
    </main>
  );
}
