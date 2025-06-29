import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import FormField from '@/components/molecules/FormField';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { webhookService } from '@/services/api/webhookService';

const WebhookForm = ({ editData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: editData?.name || '',
    url: editData?.url || '',
    events: editData?.events || [],
    isActive: editData?.isActive ?? true
  });
  const [loading, setLoading] = useState(false);

  const availableEvents = [
    'article.published',
    'article.updated',
    'filter.applied',
    'user.registered'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEventToggle = (event) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editData) {
        await webhookService.update(editData.Id, formData);
        toast.success('Webhook updated successfully');
      } else {
        await webhookService.create(formData);
        toast.success('Webhook created successfully');
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
        {editData ? 'Edit Webhook' : 'Create New Webhook'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Webhook Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., N8N Integration"
          required
        />

        <FormField
          label="Webhook URL"
          name="url"
          type="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://your-service.com/webhook"
          required
        />

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-3">
            Events to Subscribe
          </label>
          <div className="space-y-2">
            {availableEvents.map(event => (
              <div key={event} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={event}
                  checked={formData.events.includes(event)}
                  onChange={() => handleEventToggle(event)}
                  className="w-4 h-4 text-accent-600 focus:ring-accent-500 border-surface-300 rounded"
                />
                <label htmlFor={event} className="text-sm text-surface-700">
                  {event}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 text-accent-600 focus:ring-accent-500 border-surface-300 rounded"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-surface-700">
            Active (receive webhook notifications)
          </label>
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
            {editData ? 'Update Webhook' : 'Create Webhook'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const ApiWebhooks = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState(null);
  const [activeTab, setActiveTab] = useState('webhooks'); // webhooks, api-docs

  const loadWebhooks = async () => {
    setLoading(true);
    setError('');
    
    try {
      const webhooksData = await webhookService.getAll();
      setWebhooks(webhooksData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'webhooks') {
      loadWebhooks();
    } else {
      setLoading(false);
    }
  }, [activeTab]);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingWebhook(null);
    loadWebhooks();
  };

  const handleEdit = (webhook) => {
    setEditingWebhook(webhook);
    setShowForm(true);
  };

  const handleDelete = async (webhookId) => {
    if (!confirm('Are you sure you want to delete this webhook?')) return;

    try {
      await webhookService.delete(webhookId);
      toast.success('Webhook deleted successfully');
      loadWebhooks();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleTest = async (webhookId) => {
    try {
      const result = await webhookService.test(webhookId);
      toast.success(`Webhook test successful (${result.responseTime}ms)`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const renderWebhooks = () => {
    if (loading) return <Loading type="table" />;
    if (error) return <Error message={error} onRetry={loadWebhooks} />;

    return (
      <div className="space-y-6">
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
                <WebhookForm
                  editData={editingWebhook}
                  onSuccess={handleFormSuccess}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingWebhook(null);
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-surface-900">Webhooks</h2>
            <p className="text-surface-600">Configure webhook endpoints for real-time notifications</p>
          </div>
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => setShowForm(true)}
          >
            Add Webhook
          </Button>
        </div>

        {webhooks.length === 0 ? (
          <Empty
            title="No webhooks configured"
            description="Set up webhooks to receive real-time notifications when events occur."
            actionLabel="Add First Webhook"
            onAction={() => setShowForm(true)}
            icon="Webhook"
          />
        ) : (
          <motion.div
            className="grid gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {webhooks.map((webhook, index) => (
              <motion.div
                key={webhook.Id}
                className="card p-6 hover:shadow-medium transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-surface-900">{webhook.name}</h3>
                      <Badge variant={webhook.isActive ? 'success' : 'warning'}>
                        {webhook.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Link" className="w-4 h-4 text-surface-500" />
                        <code className="bg-surface-100 px-2 py-1 rounded text-xs break-all">
                          {webhook.url}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Copy"
                          onClick={() => copyToClipboard(webhook.url)}
                          className="p-1"
                        />
                      </div>

                      <div className="flex items-start space-x-2">
                        <ApperIcon name="Zap" className="w-4 h-4 text-surface-500 mt-0.5" />
                        <div>
                          <span className="font-medium text-surface-700">Events: </span>
                          <span className="text-surface-600">
                            {webhook.events?.join(', ') || 'None configured'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="CheckCircle" className="w-4 h-4 text-green-500" />
                          <span className="text-surface-600">{webhook.successCount} successful</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="XCircle" className="w-4 h-4 text-red-500" />
                          <span className="text-surface-600">{webhook.errorCount} failed</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Clock" className="w-4 h-4 text-surface-500" />
                          <span className="text-surface-600">
                            {webhook.lastTriggered ? 
                              formatDistanceToNow(new Date(webhook.lastTriggered), { addSuffix: true }) : 
                              'Never triggered'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      icon="Play"
                      onClick={() => handleTest(webhook.Id)}
                    >
                      Test
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Edit"
                      onClick={() => handleEdit(webhook)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() => handleDelete(webhook.Id)}
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

  const renderApiDocs = () => {
    const endpoints = [
      {
        method: 'GET',
        path: '/api/articles',
        description: 'Retrieve all articles with optional filtering',
        params: ['category', 'source', 'limit', 'offset']
      },
      {
        method: 'GET',
        path: '/api/articles/{id}',
        description: 'Get a specific article by ID',
        params: []
      },
      {
        method: 'GET',
        path: '/api/filters/{id}/articles',
        description: 'Get articles matching a specific filter',
        params: ['limit', 'offset']
      },
      {
        method: 'GET',
        path: '/api/sources',
        description: 'List all feed sources',
        params: []
      }
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-surface-900 mb-2">API Documentation</h2>
          <p className="text-surface-600">REST API endpoints for accessing your aggregated content</p>
        </div>

        {/* Authentication */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Authentication</h3>
          <p className="text-surface-600 mb-4">
            All API requests require authentication using your API key in the Authorization header:
          </p>
          <div className="bg-surface-900 text-surface-100 p-4 rounded-lg text-sm font-mono">
            Authorization: Bearer YOUR_API_KEY
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-4">
          {endpoints.map((endpoint, index) => (
            <motion.div
              key={index}
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start space-x-4 mb-4">
                <Badge variant={endpoint.method === 'GET' ? 'success' : 'info'}>
                  {endpoint.method}
                </Badge>
                <div className="flex-1">
                  <code className="text-surface-900 font-semibold">
                    {endpoint.path}
                  </code>
                  <p className="text-surface-600 mt-1">{endpoint.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Copy"
                  onClick={() => copyToClipboard(`${endpoint.method} ${endpoint.path}`)}
                />
              </div>

              {endpoint.params.length > 0 && (
                <div>
                  <h4 className="font-medium text-surface-900 mb-2">Parameters:</h4>
                  <div className="flex flex-wrap gap-2">
                    {endpoint.params.map(param => (
                      <code key={param} className="bg-surface-100 px-2 py-1 rounded text-xs">
                        {param}
                      </code>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Example Response */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Example Response</h3>
          <div className="bg-surface-900 text-surface-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
            <pre>{`{
  "data": [
    {
      "id": "1",
      "title": "AI startup raises $50M in Series B funding",
      "content": "Lorem ipsum dolor sit amet...",
      "summary": "AI startup secures significant funding",
      "publishDate": "2024-01-15T09:30:00Z",
      "author": "Sarah Johnson",
      "source": "TechCrunch",
      "category": "Technology",
      "tags": ["AI", "funding", "startup"],
      "url": "https://techcrunch.com/article-1"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10
  }
}`}</pre>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">API & Webhooks</h1>
        <p className="text-surface-600">Configure API access and webhook integrations</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-200">
        <nav className="flex space-x-8">
          {[
            { key: 'webhooks', label: 'Webhooks', icon: 'Webhook' },
            { key: 'api-docs', label: 'API Documentation', icon: 'Code' }
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === key
                  ? 'border-accent-500 text-accent-600'
                  : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
              }`}
            >
              <ApperIcon name={icon} className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'webhooks' ? renderWebhooks() : renderApiDocs()}
    </div>
  );
};

export default ApiWebhooks;