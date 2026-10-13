/**
 * Renders a link only when the restaurant has configured a real URL.
 * Demo values without `href` stay plain text instead of pointing nowhere.
 */
export function ContactLink({ href, external = false, className, children }) {
  if (!href) return <span className={className}>{children}</span>;
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}
