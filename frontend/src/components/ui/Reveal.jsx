import { m } from 'framer-motion';

/**
 * Fades content in once when it scrolls into view. Kept short and small so
 * it reads as polish, not as a show. Respects reduced motion via MotionConfig.
 */
export function Reveal({ as = 'div', delay = 0, y = 18, className, children, ...rest }) {
  const Component = m[as] ?? m.div;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.55, delay, ease: [0.2, 0.8, 0.2, 1] }}
      {...rest}
    >
      {children}
    </Component>
  );
}
