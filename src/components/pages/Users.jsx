import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { userService } from '@/services/api/userService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, pending, approved

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const usersData = await userService.getAll();
      setUsers(usersData);
      filterUsers(usersData, searchTerm, filterType);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = (usersData, search, type) => {
    let filtered = [...usersData];

    // Filter by approval status
    if (type === 'pending') {
      filtered = filtered.filter(user => !user.isApproved);
    } else if (type === 'approved') {
      filtered = filtered.filter(user => user.isApproved);
    }

    // Filter by search term
    if (search) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers(users, searchTerm, filterType);
  }, [searchTerm, filterType, users]);

  const handleApprove = async (userId) => {
    try {
      await userService.approve(userId);
      toast.success('User approved successfully');
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await userService.delete(userId);
      toast.success('User deleted successfully');
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGenerateApiKey = async (userId) => {
    try {
      await userService.generateApiKey(userId);
      toast.success('New API key generated successfully');
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const copyApiKey = (apiKey) => {
    navigator.clipboard.writeText(apiKey);
    toast.success('API key copied to clipboard');
  };

  const getRoleBadge = (role) => {
    return role === 'admin' ? 
      <Badge variant="primary">Admin</Badge> : 
      <Badge variant="info">User</Badge>;
  };

  const getStatusBadge = (isApproved) => {
    return isApproved ? 
      <Badge variant="success">Approved</Badge> : 
      <Badge variant="warning">Pending</Badge>;
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadUsers} />;

  const pendingCount = users.filter(u => !u.isApproved).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">User Management</h1>
          <p className="text-surface-600">Manage user registrations and permissions</p>
          {pendingCount > 0 && (
            <div className="flex items-center space-x-2 mt-2">
              <ApperIcon name="AlertCircle" className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-600 font-medium">
                {pendingCount} user{pendingCount !== 1 ? 's' : ''} pending approval
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search users..."
          className="max-w-md"
        />
        
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'All Users' },
            { key: 'pending', label: 'Pending' },
            { key: 'approved', label: 'Approved' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterType(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === key
                  ? 'bg-accent-600 text-white'
                  : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
              }`}
            >
              {label}
              {key === 'pending' && pendingCount > 0 && (
                <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <Empty
          title="No users found"
          description={searchTerm ? "No users match your search criteria." : "No users to display for the selected filter."}
          icon="Users"
        />
      ) : (
        <motion.div
          className="grid gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.Id}
              className="card p-6 hover:shadow-medium transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-surface-900">{user.name}</h3>
                      <p className="text-surface-600">{user.email}</p>
                    </div>
                    <div className="flex space-x-2">
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.isApproved)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-surface-700">Registered:</span>
                      <div className="text-surface-600">
                        {formatDistanceToNow(new Date(user.registrationDate), { addSuffix: true })}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium text-surface-700">Last Active:</span>
                      <div className="text-surface-600">
                        {user.lastActive ? formatDistanceToNow(new Date(user.lastActive), { addSuffix: true }) : 'Never'}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium text-surface-700">Filters:</span>
                      <div className="text-surface-600">
                        {user.assignedFilters?.length || 0} assigned
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium text-surface-700">API Key:</span>
                      <div className="flex items-center space-x-2">
                        {user.apiKey ? (
                          <>
                            <code className="text-xs bg-surface-100 px-2 py-1 rounded">
                              {user.apiKey.substring(0, 12)}...
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              icon="Copy"
                              onClick={() => copyApiKey(user.apiKey)}
                              className="p-1"
                            />
                          </>
                        ) : (
                          <span className="text-surface-500 text-xs">Not generated</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {!user.isApproved && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon="Check"
                      onClick={() => handleApprove(user.Id)}
                    >
                      Approve
                    </Button>
                  )}
                  
                  {user.isApproved && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon="Key"
                      onClick={() => handleGenerateApiKey(user.Id)}
                    >
                      New API Key
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={() => handleDelete(user.Id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Users;