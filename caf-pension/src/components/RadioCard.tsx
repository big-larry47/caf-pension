import React from 'react';

interface RadioCardProps {
  id: string;
  name: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  hint?: string;
  amount?: string;
  desc?: string;
  note?: string;
}

export const RadioCard: React.FC<RadioCardProps> = ({
  id,
  name,
  checked,
  disabled = false,
  onChange,
  title,
  hint,
  amount,
  desc,
  note,
}) => {
  const cardClasses = [
    'radio-card',
    checked && !disabled ? 'radio-card--selected' : '',
    disabled ? 'radio-card--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label htmlFor={id} className={cardClasses}>
      <input
        type="radio"
        id={id}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <div className="radio-card__content" style={{ flex: 1, minWidth: 0 }}>
        {amount ? (
          <>
            <div className="benefit-card__header">
              <span className="benefit-card__title">{title}</span>
              <span className="benefit-card__amount">{amount}</span>
            </div>
            {desc && <span className="benefit-card__desc">{desc}</span>}
            {note && <span className="benefit-card__note">{note}</span>}
          </>
        ) : (
          <>
            <span className="radio-card__title">{title}</span>
            {hint && <span className="radio-card__hint">{hint}</span>}
          </>
        )}
      </div>
    </label>
  );
};
