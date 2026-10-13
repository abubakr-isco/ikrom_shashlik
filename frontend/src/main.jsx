import '@fontsource-variable/sofia-sans';
import '@fontsource-variable/sofia-sans-extra-condensed';
// Global styles first, so component CSS modules can override them.
import './styles/tokens.css';
import './styles/base.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
