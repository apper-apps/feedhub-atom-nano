import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import SearchBar from '@/components/molecules/SearchBar';
import ArticleList from '@/components/organisms/ArticleList';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { articleService } from '@/services/api/articleService';
import { feedSourceService } from '@/services/api/feedSourceService';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [feedSources, setFeedSources] = useState([]);
  const [fetchingRss, setFetchingRss] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    source: ''
  });
  const categories = ['Technology', 'Business', 'Finance', 'Environment', 'Science', 'Health'];

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [articlesData, sourcesData] = await Promise.all([
        articleService.getAll(filters),
        feedSourceService.getAll()
      ]);
      setArticles(articlesData);
      setFeedSources(sourcesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      source: ''
    });
  };
const handleFetchRss = async () => {
    setFetchingRss(true);
    try {
      const newArticles = await articleService.fetchAllRssFeeds();
      if (newArticles.length > 0) {
        setArticles(prev => {
          const existingIds = new Set(prev.map(a => a.Id));
          const uniqueNewArticles = newArticles.filter(a => !existingIds.has(a.Id));
          return [...uniqueNewArticles, ...prev];
        });
        toast.success(`Fetched ${newArticles.length} new articles from RSS feeds`);
      } else {
        toast.info('No new articles found from RSS feeds');
      }
    } catch (err) {
      toast.error(`Failed to fetch RSS feeds: ${err.message}`);
    } finally {
      setFetchingRss(false);
    }
  };

  const handleArticleClick = (article) => {
    // Open article in new tab
    if (article.url) {
      window.open(article.url, '_blank');
    } else {
      toast.info('Article URL not available');
    }
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;
  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Articles</h1>
          <p className="text-surface-600">Browse and filter aggregated news articles</p>
        </div>
<div className="flex items-center space-x-3">
          {activeFiltersCount > 0 && (
            <Badge variant="info">
              {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
            </Badge>
          )}
          <Button
            variant="primary"
            icon="Rss"
            onClick={handleFetchRss}
            disabled={fetchingRss}
          >
            {fetchingRss ? 'Fetching...' : 'Fetch News'}
          </Button>
          <Button
            variant="outline"
            icon="RotateCcw"
            onClick={loadData}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-surface-900">Filters</h3>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                icon="X"
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <SearchBar
              onSearch={(term) => handleFilterChange('search', term)}
              placeholder="Search articles..."
            />

            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={filters.source}
              onChange={(e) => handleFilterChange('source', e.target.value)}
              className="input"
            >
              <option value="">All Sources</option>
              {feedSources.map(source => (
                <option key={source.Id} value={source.Id}>{source.name}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-surface-900">{articles.length}</div>
          <div className="text-sm text-surface-600">Total Articles</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-accent-600">
            {new Set(articles.map(a => a.category)).size}
          </div>
          <div className="text-sm text-surface-600">Categories</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {new Set(articles.map(a => a.sourceName)).size}
          </div>
          <div className="text-sm text-surface-600">Sources</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {articles.filter(a => {
              const today = new Date();
              const articleDate = new Date(a.publishDate);
              return articleDate.toDateString() === today.toDateString();
            }).length}
          </div>
          <div className="text-sm text-surface-600">Today</div>
        </div>
      </div>

      {/* Articles List */}
      {articles.length === 0 ? (
        <Empty
          title="No articles found"
          description="No articles match your current filter criteria."
          actionLabel="Clear Filters"
          onAction={clearFilters}
          icon="FileText"
        />
      ) : (
        <ArticleList 
          articles={articles}
          onArticleClick={handleArticleClick}
        />
      )}
    </div>
  );
};

export default Articles;