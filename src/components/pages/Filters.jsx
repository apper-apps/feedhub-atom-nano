import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { filterService } from '@/services/api/filterService';

const FilterForm = ({ editData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: editData?.name || '',
    description: editData?.description || '',
    rules: {
      keywords: editData?.rules?.keywords?.join(', ') || '',
      categories: editData?.rules?.categories || [],
      sources: editData?.rules?.sources || [],
      excludeKeywords: editData?.rules?.excludeKeywords?.join(', ') || ''
    }
  });
  const [loading, setLoading] = useState(false);

  const categories = ['Technology', 'Business', 'Finance', 'Environment', 'Science', 'Health'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('rules.')) {
      const ruleName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        rules: {
          ...prev.rules,
          [ruleName]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      rules: {
        ...prev.rules,
        categories: prev.rules.categories.includes(category)
          ? prev.rules.categories.filter(c => c !== category)
          : [...prev.rules.categories, category]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const filterData = {
        ...formData,
        rules: {
          keywords: formData.rules.keywords.split(',').map(k => k.trim()).filter(Boolean),
          categories: formData.rules.categories,
          sources: formData.rules.sources,
          excludeKeywords: formData.rules.excludeKeywords.split(',').map(k => k.trim()).filter(Boolean)
        }
      };

      if (editData) {
        await filterService.update(editData.Id, filterData);
        toast.success('Filter updated successfully');
      } else {
        await filterService.create(filterData);
        toast.success('Filter created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-semibold text-surface-900 mb-6">
        {editData ? 'Edit Filter' : 'Create New Filter'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Filter Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input"
            placeholder="e.g., Technology News"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input min-h-[80px]"
            placeholder="Describe what this filter captures..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Include Keywords (comma-separated)
          </label>
          <input
            type="text"
            name="rules.keywords"
            value={formData.rules.keywords}
            onChange={handleChange}
            className="input"
            placeholder="AI, technology, innovation, startup"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Categories
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  formData.rules.categories.includes(category)
                    ? 'bg-accent-600 text-white'
                    : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Exclude Keywords (comma-separated)
          </label>
          <input
            type="text"
            name="rules.excludeKeywords"
            value={formData.rules.excludeKeywords}
            onChange={handleChange}
            className="input"
            placeholder="politics, sports, celebrity"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-surface-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            {editData ? 'Update Filter' : 'Create Filter'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const Filters = () => {
  const [filters, setFilters] = useState([]);
  const [filteredFilters, setFilteredFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingFilter, setEditingFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadFilters = async () => {
    setLoading(true);
    setError('');
    
    try {
      const filtersData = await filterService.getAll();
      setFilters(filtersData);
      setFilteredFilters(filtersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = filters.filter(filter =>
        filter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        filter.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFilters(filtered);
    } else {
      setFilteredFilters(filters);
    }
  }, [searchTerm, filters]);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingFilter(null);
    loadFilters();
  };

  const handleEdit = (filter) => {
    setEditingFilter(filter);
    setShowForm(true);
  };

  const handleDelete = async (filterId) => {
    if (!confirm('Are you sure you want to delete this filter?')) return;

    try {
      await filterService.delete(filterId);
      toast.success('Filter deleted successfully');
      loadFilters();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadFilters} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Content Filters</h1>
          <p className="text-surface-600">Create and manage filters to control what content users see</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setShowForm(true)}
        >
          Create Filter
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        onSearch={setSearchTerm}
        placeholder="Search filters..."
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
              <FilterForm
                editData={editingFilter}
                onSuccess={handleFormSuccess}
                onCancel={() => {
                  setShowForm(false);
                  setEditingFilter(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters List */}
      {filteredFilters.length === 0 ? (
        <Empty
          title="No filters found"
          description={searchTerm ? "No filters match your search criteria." : "Create your first content filter to control what articles users see."}
          actionLabel={!searchTerm ? "Create Filter" : undefined}
          onAction={!searchTerm ? () => setShowForm(true) : undefined}
          icon="Filter"
        />
      ) : (
        <motion.div
          className="grid gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredFilters.map((filter, index) => (
            <motion.div
              key={filter.Id}
              className="card p-6 hover:shadow-medium transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-surface-900">{filter.name}</h3>
                    <Badge variant={filter.isActive ? 'success' : 'warning'}>
                      {filter.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <p className="text-surface-600 mb-4">{filter.description}</p>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <ApperIcon name="Tags" className="w-4 h-4 text-surface-500 mt-0.5" />
                      <div>
                        <span className="font-medium text-surface-700">Keywords: </span>
                        <span className="text-surface-600">
                          {filter.rules.keywords?.join(', ') || 'None'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <ApperIcon name="Folder" className="w-4 h-4 text-surface-500 mt-0.5" />
                      <div>
                        <span className="font-medium text-surface-700">Categories: </span>
                        <span className="text-surface-600">
                          {filter.rules.categories?.join(', ') || 'All'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <ApperIcon name="Users" className="w-4 h-4 text-surface-500 mt-0.5" />
                      <div>
                        <span className="font-medium text-surface-700">Assigned Users: </span>
                        <span className="text-surface-600">{filter.assignedUsers?.length || 0}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-surface-500">
                      <ApperIcon name="Calendar" className="w-4 h-4" />
                      <span>Created {formatDistanceToNow(new Date(filter.createdDate), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Edit"
                    onClick={() => handleEdit(filter)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={() => handleDelete(filter.Id)}
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

export default Filters;