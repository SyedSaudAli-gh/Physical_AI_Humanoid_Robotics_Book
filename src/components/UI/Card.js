import React from 'react';
import clsx from 'clsx';

/**
 * Accessible Card Component
 * Follows WCAG 2.1 AA compliance guidelines
 */
const Card = ({
  children,
  title,
  description,
  className = '',
  variant = 'default',
  ...props
}) => {
  return (
    <div
      className={clsx(
        'card',
        `card--${variant}`,
        className
      )}
      role="region"
      aria-label={title || 'Card content'}
      {...props}
    >
      {(title || description) && (
        <div className="card__header">
          {title && <h3 className="card__title">{title}</h3>}
          {description && <p className="card__description">{description}</p>}
        </div>
      )}
      <div className="card__body">{children}</div>
    </div>
  );
};

export default Card;