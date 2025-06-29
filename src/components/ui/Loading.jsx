import { motion } from 'framer-motion';

const Loading = ({ type = 'default' }) => {
  if (type === 'table') {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg border border-surface-200 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-surface-200 to-surface-300 rounded-full animate-pulse" />
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-pulse" />
                  <div className="w-24 h-3 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-pulse" />
                </div>
              </div>
              <div className="w-16 h-6 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl border border-surface-200 p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="space-y-4">
              <div className="w-full h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-pulse" />
              <div className="w-3/4 h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-pulse" />
              <div className="flex justify-between items-center">
                <div className="w-20 h-6 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-pulse" />
                <div className="w-16 h-8 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-pulse" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        className="flex items-center space-x-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full animate-bounce" />
        <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
        <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
      </motion.div>
    </div>
  );
};

export default Loading;