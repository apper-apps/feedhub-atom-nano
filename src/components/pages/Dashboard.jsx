import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatusCard from "@/components/molecules/StatusCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import AppIcon from "@/components/ui/AppIcon";
import { feedSourceService } from "@/services/api/feedSourceService";
import { articleService } from "@/services/api/articleService";
import { userService } from "@/services/api/userService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSources: 0,
    activeSources: 0,
    totalArticles: 0,
    todayArticles: 0,
    totalUsers: 0,
    pendingUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [sources, articleSummary, users] = await Promise.all([
        feedSourceService.getAll(),
        articleService.getSummary(),
        userService.getAll()
      ]);

      setStats({
        totalSources: sources.length,
        activeSources: sources.filter(s => s.isActive).length,
        totalArticles: articleSummary.totalArticles,
        todayArticles: articleSummary.todayArticles,
        totalUsers: users.length,
        pendingUsers: users.filter(u => !u.isApproved).length
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-accent-600 to-accent-700 rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome to FeedHub Pro</h1>
        <p className="text-accent-100 text-lg">
          Monitor your RSS feeds, manage content filters, and distribute news efficiently
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatusCard
          title="Total Feed Sources"
          value={stats.totalSources}
          icon="Rss"
          color="blue"
          trend="up"
          trendValue="+2 this week"
        />
        <StatusCard
          title="Active Sources"
          value={stats.activeSources}
          icon="Activity"
          color="green"
          trend="up"
          trendValue="+1 today"
        />
        <StatusCard
          title="Total Articles"
          value={stats.totalArticles.toLocaleString()}
          icon="FileText"
          color="purple"
          trend="up"
          trendValue="+12% this month"
        />
        <StatusCard
          title="Today's Articles"
          value={stats.todayArticles}
          icon="Calendar"
          color="orange"
          trend="up"
          trendValue="+5 from yesterday"
        />
        <StatusCard
          title="Registered Users"
          value={stats.totalUsers}
          icon="Users"
          color="blue"
          trend="up"
          trendValue="+3 this week"
        />
        <StatusCard
          title="Pending Approvals"
          value={stats.pendingUsers}
          icon="Clock"
          color={stats.pendingUsers > 0 ? "red" : "green"}
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {[
          { title: 'Add Feed Source', icon: 'Plus', href: '/feed-sources', color: 'blue' },
          { title: 'Create Filter', icon: 'Filter', href: '/filters', color: 'green' },
          { title: 'Manage Users', icon: 'UserCheck', href: '/users', color: 'purple' },
          { title: 'API Settings', icon: 'Settings', href: '/api', color: 'orange' }
        ].map((action, index) => (
          <motion.div
            key={action.title}
            className={`card p-6 cursor-pointer hover:shadow-medium transition-all duration-200 border-l-4 border-${action.color}-500`}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
<div className="flex items-center space-x-3">
              <div className={`p-2 bg-${action.color}-100 rounded-lg`}>
                <AppIcon name={action.icon} className={`w-5 h-5 text-${action.color}-600`} />
              </div>
              <div>
                <h3 className="font-medium text-surface-900">{action.title}</h3>
                <p className="text-sm text-surface-600">Quick access</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* System Status */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="font-medium text-surface-900">Feed Fetcher</p>
              <p className="text-sm text-surface-600">Running normally</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="font-medium text-surface-900">API Endpoints</p>
              <p className="text-sm text-surface-600">All systems operational</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
            <div>
              <p className="font-medium text-surface-900">Webhook Delivery</p>
              <p className="text-sm text-surface-600">2 failed deliveries</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;