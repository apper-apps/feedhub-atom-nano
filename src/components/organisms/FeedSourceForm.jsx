import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import { feedSourceService } from '@/services/api/feedSourceService';

const FeedSourceForm = ({ onSuccess, onCancel, editData = null }) => {
  const [formData, setFormData] = useState({
    name: editData?.name || '',
    url: editData?.url || '',
    fetchInterval: editData?.fetchInterval || 30,
    isActive: editData?.isActive ?? true
  });
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.url.trim()) newErrors.url = 'URL is required';
    if (!formData.url.match(/^https?:\/\/.+/)) newErrors.url = 'Please enter a valid URL';
    if (formData.fetchInterval < 5) newErrors.fetchInterval = 'Minimum interval is 5 minutes';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTestFeed = async () => {
    if (!formData.url.trim()) {
      toast.error('Please enter a URL first');
      return;
    }

    setTesting(true);
    try {
      const result = await feedSourceService.testFeed(formData.url);
      toast.success(`Feed test successful! Found ${result.itemCount} items`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (editData) {
        await feedSourceService.update(editData.Id, formData);
        toast.success('Feed source updated successfully');
      } else {
        await feedSourceService.create(formData);
        toast.success('Feed source created successfully');
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
        {editData ? 'Edit Feed Source' : 'Add New Feed Source'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Source Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="e.g., TechCrunch, BBC News"
          required
        />

        <div className="flex gap-3">
          <div className="flex-1">
            <FormField
              label="RSS Feed URL"
              name="url"
              type="url"
              value={formData.url}
              onChange={handleChange}
              error={errors.url}
              placeholder="https://example.com/feed.xml"
              required
            />
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleTestFeed}
              loading={testing}
              disabled={!formData.url.trim()}
            >
              Test Feed
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Fetch Interval (minutes)"
            name="fetchInterval"
            type="number"
            value={formData.fetchInterval}
            onChange={handleChange}
            error={errors.fetchInterval}
            min="5"
            required
          />

          <div className="flex items-center space-x-3 pt-6">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-accent-600 focus:ring-accent-500 border-surface-300 rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-surface-700">
              Active (fetch articles automatically)
            </label>
          </div>
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
            {editData ? 'Update Source' : 'Add Source'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default FeedSourceForm;