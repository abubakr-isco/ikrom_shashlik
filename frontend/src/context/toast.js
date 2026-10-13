import { createContext, useContext } from 'react';

export const ToastContext = createContext(null);

/** @returns {(message: string, options?: { tone?: 'info' | 'success' | 'error', duration?: number }) => void} */
export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useToast must be used inside <ToastProvider>');
  return value;
}
