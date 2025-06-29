import ApperIcon from '@/components/ApperIcon';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  icon,
  className = ''
}) => {
  const variants = {
    default: 'bg-surface-100 text-surface-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    primary: 'bg-accent-100 text-accent-800'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`
      inline-flex items-center rounded-full font-medium
      ${variants[variant]} 
      ${sizes[size]}
      ${className}
    `}>
      {icon && <ApperIcon name={icon} className="w-3 h-3 mr-1" />}
      {children}
    </span>
  );
};

export default Badge;