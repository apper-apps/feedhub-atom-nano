import Input from '@/components/atoms/Input';

const FormField = ({ 
  type = 'text',
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  icon,
  ...props
}) => {
  if (type === 'textarea') {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-surface-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            input min-h-[100px] resize-vertical
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  if (type === 'select') {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-surface-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`
            input
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
          `}
          {...props}
        >
          {props.children}
        </select>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  return (
    <Input
      type={type}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      error={error}
      required={required}
      placeholder={placeholder}
      icon={icon}
      {...props}
    />
  );
};

export default FormField;