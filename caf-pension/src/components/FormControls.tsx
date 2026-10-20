import React from 'react';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  mono?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
  id,
  label,
  hint,
  error,
  mono = false,
  className = '',
  style,
  ...rest
}) => {
  const inputClass = [
    'field__input',
    mono ? 'field__input--mono' : '',
    error ? 'field__input--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      {hint && <p className="field__hint">{hint}</p>}
      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}
      <input id={id} className={inputClass} style={style} {...rest} />
    </div>
  );
};

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  options: { value: string; label: string }[] | string[];
}

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  hint,
  error,
  options,
  className = '',
  ...rest
}) => {
  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      {hint && <p className="field__hint">{hint}</p>}
      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}
      <select id={id} className={`field__select ${className}`} {...rest}>
        {options.map((opt) => {
          if (typeof opt === 'string') {
            return (
              <option key={opt} value={opt}>
                {opt}
              </option>
            );
          }
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  children: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({ id, children, ...rest }) => {
  return (
    <label htmlFor={id} className="checkbox-label">
      <input type="checkbox" id={id} {...rest} />
      <span>{children}</span>
    </label>
  );
};

interface RadioOption {
  value: string;
  label: React.ReactNode;
  id?: string;
}

interface RadioGroupProps {
  legend: string;
  name: string;
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  hint?: string;
  layout?: 'vertical' | 'horizontal';
  legendVisuallyHidden?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  legend,
  name,
  options,
  selectedValue,
  onChange,
  hint,
  layout = 'horizontal',
  legendVisuallyHidden = false,
}) => {
  return (
    <fieldset className="fieldset-reset">
      <legend
        className={legendVisuallyHidden ? 'sr-only' : 'legend-title'}
      >
        {legend}
      </legend>
      {hint && <p className="field__hint">{hint}</p>}
      <div
        style={{
          display: 'flex',
          flexDirection: layout === 'vertical' ? 'column' : 'row',
          gap: layout === 'vertical' ? '10px' : '28px',
          flexWrap: 'wrap',
        }}
      >
        {options.map((opt) => {
          const optId = opt.id || `${name}-${opt.value}`;
          return (
            <label key={opt.value} htmlFor={optId} className="radio-inline">
              <input
                type="radio"
                id={optId}
                name={name}
                value={opt.value}
                checked={selectedValue === opt.value}
                onChange={() => onChange(opt.value)}
              />
              {opt.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};
