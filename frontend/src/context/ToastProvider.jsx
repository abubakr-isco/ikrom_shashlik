import { AnimatePresence, m } from 'framer-motion';
import { Check, CircleAlert, Info } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ToastContext } from './toast.js';
import styles from './Toaster.module.css';

const ICONS = { success: Check, error: CircleAlert, info: Info };
const MAX_VISIBLE = 3;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((toast) => toast.id !== id));
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  }, []);

  const show = useCallback(
    (message, { tone = 'success', duration = 2600 } = {}) => {
      const id = ++nextId.current;
      setToasts((list) => [...list.slice(-(MAX_VISIBLE - 1)), { id, message, tone }]);
      timers.current.set(id, setTimeout(() => dismiss(id), duration));
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className={styles.region} role="status" aria-live="polite">
        <AnimatePresence initial={false}>
          {toasts.map(({ id, message, tone }) => {
            const Icon = ICONS[tone] ?? Info;
            return (
              <m.div
                key={id}
                className={styles.toast}
                data-tone={tone}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
                transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                onClick={() => dismiss(id)}
              >
                <Icon size={18} aria-hidden="true" className={styles.icon} />
                <span>{message}</span>
              </m.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
