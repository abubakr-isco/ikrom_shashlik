import { domAnimation, LazyMotion, MotionConfig } from 'framer-motion';
import { BrowserRouter, Route, Routes } from 'react-router';
import { CartBar } from './components/cart/CartBar.jsx';
import { CartDrawer } from './components/cart/CartDrawer.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { Header } from './components/layout/Header.jsx';
import { ScrollManager } from './components/layout/ScrollManager.jsx';
import { CartProvider } from './context/CartProvider.jsx';
import { ToastProvider } from './context/ToastProvider.jsx';
import { useI18n } from './i18n/context.js';
import { I18nProvider } from './i18n/I18nProvider.jsx';
import { CheckoutPage } from './pages/CheckoutPage.jsx';
import { CreditsPage } from './pages/CreditsPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

function Layout() {
  const { t } = useI18n();
  return (
    <>
      <ScrollManager />
      <a className="skip-link" href="#main">
        {t('common.skipToContent')}
      </a>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/credits" element={<CreditsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <CartDrawer />
      <CartBar />
    </>
  );
}

export function App() {
  return (
    // LazyMotion + `m` components ship only the animation features the site uses.
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <I18nProvider>
          <ToastProvider>
            <CartProvider>
              <BrowserRouter>
                <Layout />
              </BrowserRouter>
            </CartProvider>
          </ToastProvider>
        </I18nProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
