import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "No data found", 
  description = "There's nothing to show here yet.", 
  actionLabel, 
  onAction,
  icon = "Inbox"
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-gradient-to-br from-surface-100 to-surface-200 rounded-full p-6 mb-6">
        <ApperIcon name={icon} className="w-12 h-12 text-surface-400" />
      </div>
      <h3 className="text-xl font-semibold text-surface-900 mb-2">{title}</h3>
      <p className="text-surface-600 text-center mb-8 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <motion.button
          onClick={onAction}
          className="btn btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;