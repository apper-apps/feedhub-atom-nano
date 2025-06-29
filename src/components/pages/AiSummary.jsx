import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { articleService } from '@/services/api/articleService';

const AiSummary = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock AI summaries based on articles
  const generateAiSummaries = (articles) => {
    const summaries = [
      {
        id: 1,
        title: "Technology & AI Developments",
        category: "Technology",
        keyPoints: [
          "AI startup secures $50M Series B funding for expansion into healthcare sector",
          "New smartphone camera technology promises 10x improvement in low-light photography",
          "Cybersecurity firm valued at $2B in successful IPO launch"
        ],
        articleCount: 8,
        sentiment: "positive",
        confidence: 0.89,
        lastUpdated: new Date().toISOString(),
        relatedArticles: articles.filter(a => a.category === 'Technology').slice(0, 3)
      },
      {
        id: 2,
        title: "Business & Market Updates",
        category: "Business",
        keyPoints: [
          "Global stock markets rally following better-than-expected GDP figures",
          "Tech sector leads market gains with 5% increase in valuation",
          "Renewable energy investments reach record high of $300B annually"
        ],
        articleCount: 5,
        sentiment: "positive",
        confidence: 0.92,
        lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        relatedArticles: articles.filter(a => ['Business', 'Finance'].includes(a.category)).slice(0, 3)
      },
      {
        id: 3,
        title: "Environmental & Climate News",
        category: "Environment",
        keyPoints: [
          "Historic climate agreement reached at global summit with 195 countries participating",
          "Breakthrough in renewable energy storage promises 48-hour battery backup",
          "Major corporations commit to carbon neutrality by 2030"
        ],
        articleCount: 4,
        sentiment: "positive",
        confidence: 0.85,
        lastUpdated: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        relatedArticles: articles.filter(a => ['Environment', 'Science'].includes(a.category)).slice(0, 3)
      }
    ];

    return summaries;
  };

  const loadSummaries = async () => {
    setLoading(true);
    setError('');
    
    try {
      const articles = await articleService.getAll();
      const aiSummaries = generateAiSummaries(articles);
      setSummaries(aiSummaries);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummaries();
  }, []);

  const filteredSummaries = selectedCategory === 'all' 
    ? summaries 
    : summaries.filter(s => s.category === selectedCategory);

  const getSentimentBadge = (sentiment) => {
    const config = {
      positive: { variant: 'success', text: 'Positive' },
      neutral: { variant: 'info', text: 'Neutral' },
      negative: { variant: 'warning', text: 'Negative' }
    };
    return <Badge variant={config[sentiment]?.variant || 'info'}>{config[sentiment]?.text || 'Unknown'}</Badge>;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadSummaries} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">AI News Summary</h1>
          <p className="text-surface-600">AI-powered insights and key takeaways from your news feeds</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon="Brain"
            onClick={loadSummaries}
          >
            Regenerate
          </Button>
          <Button
            variant="primary"
            icon="Download"
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'Technology', 'Business', 'Environment'].map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-accent-600 text-white'
                : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
            }`}
          >
            {category === 'all' ? 'All Categories' : category}
          </button>
        ))}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-surface-900">{summaries.length}</div>
          <div className="text-sm text-surface-600">AI Summaries</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-accent-600">
            {summaries.reduce((acc, s) => acc + s.articleCount, 0)}
          </div>
          <div className="text-sm text-surface-600">Articles Analyzed</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {Math.round(summaries.reduce((acc, s) => acc + s.confidence, 0) / summaries.length * 100)}%
          </div>
          <div className="text-sm text-surface-600">Avg. Confidence</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {summaries.filter(s => s.sentiment === 'positive').length}
          </div>
          <div className="text-sm text-surface-600">Positive Trends</div>
        </div>
      </div>

      {/* Summaries */}
      {filteredSummaries.length === 0 ? (
        <Empty
          title="No summaries available"
          description="AI summaries will appear here once articles are processed."
          actionLabel="Generate Summaries"
          onAction={loadSummaries}
          icon="Brain"
        />
      ) : (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredSummaries.map((summary, index) => (
            <motion.div
              key={summary.id}
              className="card p-6 hover:shadow-medium transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-surface-900">{summary.title}</h3>
                    <Badge variant="primary">{summary.category}</Badge>
                    {getSentimentBadge(summary.sentiment)}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-surface-600">
                    <span className="flex items-center">
                      <ApperIcon name="FileText" className="w-4 h-4 mr-1" />
                      {summary.articleCount} articles
                    </span>
                    <span className="flex items-center">
                      <ApperIcon name="Target" className="w-4 h-4 mr-1" />
                      <span className={`font-medium ${getConfidenceColor(summary.confidence)}`}>
                        {Math.round(summary.confidence * 100)}% confidence
                      </span>
                    </span>
                    <span className="flex items-center">
                      <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                      {formatDistanceToNow(new Date(summary.lastUpdated), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" icon="Share">
                    Share
                  </Button>
                  <Button variant="ghost" size="sm" icon="MoreHorizontal" />
                </div>
              </div>

              {/* Key Points */}
              <div className="mb-6">
                <h4 className="font-semibold text-surface-900 mb-3 flex items-center">
                  <ApperIcon name="List" className="w-4 h-4 mr-2 text-accent-600" />
                  Key Insights
                </h4>
                <ul className="space-y-2">
                  {summary.keyPoints.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-accent-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-surface-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related Articles */}
              <div>
                <h4 className="font-semibold text-surface-900 mb-3 flex items-center">
                  <ApperIcon name="Link" className="w-4 h-4 mr-2 text-accent-600" />
                  Related Articles
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {summary.relatedArticles.map((article, articleIndex) => (
                    <div
                      key={articleIndex}
                      className="bg-surface-50 rounded-lg p-3 hover:bg-surface-100 transition-colors cursor-pointer"
                    >
                      <h5 className="font-medium text-surface-900 text-sm mb-1 line-clamp-2">
                        {article.title}
                      </h5>
                      <div className="flex items-center justify-between text-xs text-surface-600">
                        <span>{article.sourceName}</span>
                        <span>{formatDistanceToNow(new Date(article.publishDate), { addSuffix: true })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AiSummary;