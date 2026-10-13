import { getDishImage } from '../../data/menu.js';

export function DishImage({ image, alt, sizes, className, eager = false }) {
  return (
    <img
      className={className}
      src={getDishImage(image, 520)}
      srcSet={`${getDishImage(image, 520)} 520w, ${getDishImage(image, 900)} 900w`}
      sizes={sizes}
      width="520"
      height="390"
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
