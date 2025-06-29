import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  loading = false, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500 shadow-sm hover:shadow-md',
    secondary: 'bg-surface-100 text-surface-700 hover:bg-surface-200 focus:ring-surface-500 border border-surface-300',
    outline: 'border border-accent-600 text-accent-600 hover:bg-accent-50 focus:ring-accent-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-surface-600 hover:text-surface-900 hover:bg-surface-100 focus:ring-surface-500'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {loading && <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />}
      {!loading && icon && <ApperIcon name={icon} className="w-4 h-4 mr-2" />}
      {children}
    </motion.button>
  );
};

export default Button;