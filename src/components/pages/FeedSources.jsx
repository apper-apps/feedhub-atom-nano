import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import FeedSourceForm from '@/components/organisms/FeedSourceForm';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { feedSourceService } from '@/services/api/feedSourceService';

const FeedSources = () => {
  const [feedSources, setFeedSources] = useState([]);
  const [filteredSources, setFilteredSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadFeedSources = async () => {
    setLoading(true);
    setError('');
    
    try {
      const sources = await feedSourceService.getAll();
      setFeedSources(sources);
      setFilteredSources(sources);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedSources();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = feedSources.filter(source =>
        source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        source.url.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSources(filtered);
    } else {
      setFilteredSources(feedSources);
    }
  }, [searchTerm, feedSources]);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingSource(null);
    loadFeedSources();
  };

  const handleEdit = (source) => {
    setEditingSource(source);
    setShowForm(true);
  };

  const handleDelete = async (sourceId) => {
    if (!confirm('Are you sure you want to delete this feed source?')) return;

    try {
      await feedSourceService.delete(sourceId);
      toast.success('Feed source deleted successfully');
      loadFeedSources();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { variant: 'success', text: 'Active' },
      inactive: { variant: 'warning', text: 'Inactive' },
      error: { variant: 'error', text: 'Error' }
    };
    const config = statusMap[status] || statusMap.inactive;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadFeedSources} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Feed Sources</h1>
          <p className="text-surface-600">Manage your RSS feed sources and monitor their status</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setShowForm(true)}
        >
          Add Feed Source
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        onSearch={setSearchTerm}
        placeholder="Search feed sources..."
        className="max-w-md"
      />

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900 bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <FeedSourceForm
                editData={editingSource}
                onSuccess={handleFormSuccess}
                onCancel={() => {
                  setShowForm(false);
                  setEditingSource(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sources List */}
      {filteredSources.length === 0 ? (
        <Empty
          title="No feed sources found"
          description={searchTerm ? "No sources match your search criteria." : "Get started by adding your first RSS feed source."}
          actionLabel={!searchTerm ? "Add Feed Source" : undefined}
          onAction={!searchTerm ? () => setShowForm(true) : undefined}
          icon="Rss"
        />
      ) : (
        <motion.div
          className="grid gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredSources.map((source, index) => (
            <motion.div
              key={source.Id}
              className="card p-6 hover:shadow-medium transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-surface-900">{source.name}</h3>
                    {getStatusBadge(source.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm text-surface-600">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Link" className="w-4 h-4" />
                      <span className="break-all">{source.url}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Clock" className="w-4 h-4" />
                        <span>Every {source.fetchInterval} minutes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="FileText" className="w-4 h-4" />
                        <span>{source.articleCount} articles</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Calendar" className="w-4 h-4" />
                        <span>Last: {formatDistanceToNow(new Date(source.lastFetch), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Edit"
                    onClick={() => handleEdit(source)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={() => handleDelete(source.Id)}
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

export default FeedSources;