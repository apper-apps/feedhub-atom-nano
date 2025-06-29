import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Header = ({ onMenuClick }) => {
  return (
    <motion.header 
      className="bg-white border-b border-surface-200 shadow-sm"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon="Menu"
            onClick={onMenuClick}
            className="lg:hidden"
          />
          <div className="hidden lg:block">
            <h2 className="text-xl font-semibold text-surface-900">Feed Management</h2>
            <p className="text-sm text-surface-600">Manage your RSS feeds and content filters</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" icon="Bell" className="relative">
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <Button variant="ghost" size="sm" icon="Settings" />
          <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;