import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ message, onRetry }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-full p-4 mb-4">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-surface-900 mb-2">Something went wrong</h3>
      <p className="text-surface-600 text-center mb-6 max-w-md">
        {message || "We encountered an error while loading the data. Please try again."}
      </p>
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="btn btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;