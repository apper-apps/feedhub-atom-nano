import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const ArticleList = ({ articles, onArticleClick }) => {
  const formatDate = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Technology': 'info',
      'Business': 'success',
      'Finance': 'success',
      'Environment': 'primary',
      'Science': 'primary',
      'Health': 'warning'
    };
    return colorMap[category] || 'default';
  };

  return (
    <div className="space-y-4">
      {articles.map((article, index) => (
        <motion.div
          key={article.Id}
          className="card p-6 hover:shadow-medium cursor-pointer transition-all duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onArticleClick && onArticleClick(article)}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Badge variant={getCategoryColor(article.category)}>
                {article.category}
              </Badge>
              <span className="text-sm text-surface-500">{article.sourceName}</span>
            </div>
            <span className="text-sm text-surface-500">{formatDate(article.publishDate)}</span>
          </div>

          <h3 className="text-lg font-semibold text-surface-900 mb-2 line-clamp-2">
            {article.title}
          </h3>

          <p className="text-surface-600 mb-4 line-clamp-3">
            {article.summary || article.content}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-surface-500">
              <span className="flex items-center">
                <ApperIcon name="User" className="w-4 h-4 mr-1" />
                {article.author}
              </span>
              <span className="flex items-center">
                <ApperIcon name="Tags" className="w-4 h-4 mr-1" />
                {article.tags?.join(', ') || 'No tags'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="ExternalLink" className="w-4 h-4 text-accent-600" />
              <span className="text-sm text-accent-600 font-medium">Read more</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ArticleList;