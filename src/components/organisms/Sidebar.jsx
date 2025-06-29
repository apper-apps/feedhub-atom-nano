import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Sidebar = ({ onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'BarChart3' },
    { name: 'Feed Sources', href: '/feed-sources', icon: 'Rss' },
    { name: 'Articles', href: '/articles', icon: 'FileText' },
    { name: 'Filters', href: '/filters', icon: 'Filter' },
    { name: 'Users', href: '/users', icon: 'Users' },
    { name: 'API & Webhooks', href: '/api', icon: 'Webhook' },
    { name: 'AI Summary', href: '/ai-summary', icon: 'Brain' },
  ];

  return (
    <div className="flex flex-col w-64 bg-white border-r border-surface-200 shadow-lg">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl shadow-lg">
            <ApperIcon name="Rss" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-surface-900">FeedHub Pro</h1>
            <p className="text-xs text-surface-500">News Aggregator</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg'
                    : 'text-surface-700 hover:text-surface-900 hover:bg-surface-100'
                }`
              }
            >
              {({ isActive }) => (
                <motion.div 
                  className="flex items-center w-full"
                  whileHover={{ x: isActive ? 0 : 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <ApperIcon 
                    name={item.icon} 
                    className={`w-5 h-5 mr-3 ${
                      isActive 
                        ? 'text-white' 
                        : 'text-surface-500 group-hover:text-surface-700'
                    }`}
                  />
                  {item.name}
                </motion.div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-surface-200">
        <div className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-surface-300 to-surface-400 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-4 h-4 text-surface-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-surface-900">Admin User</p>
            <p className="text-xs text-surface-500 truncate">admin@feedhub.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;