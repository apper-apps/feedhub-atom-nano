import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatusCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = 'blue',
  className = ''
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600'
  };

  return (
    <motion.div
      className={`card p-6 ${className}`}
      whileHover={{ y: -2, shadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-surface-600 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-surface-900 mb-2">{value}</p>
          {trend && (
            <div className="flex items-center text-sm">
              <ApperIcon 
                name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                className={`w-4 h-4 mr-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
              />
              <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                {trendValue}
              </span>
              <span className="text-surface-500 ml-1">from last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatusCard;