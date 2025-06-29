import articlesData from '@/services/mockData/articles.json';
import Parser from 'rss-parser';

let articles = [...articlesData];
let nextId = Math.max(...articles.map(a => a.Id)) + 1;

const parser = new Parser({
  customFields: {
    item: ['media:content', 'media:thumbnail']
  }
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const articleService = {
  async getAll(filters = {}) {
    await delay(400);
    let filteredArticles = [...articles];
    
    if (filters.category) {
      filteredArticles = filteredArticles.filter(article => 
        article.category === filters.category
      );
    }
    
    if (filters.source) {
      filteredArticles = filteredArticles.filter(article => 
        article.sourceId === parseInt(filters.source)
      );
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredArticles = filteredArticles.filter(article => 
        article.title.toLowerCase().includes(searchTerm) || 
        article.content.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sort by publish date (newest first)
    filteredArticles.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
    
    return filteredArticles;
  },

  async getById(id) {
    await delay(200);
    const article = articles.find(item => item.Id === parseInt(id));
    if (!article) {
      throw new Error('Article not found');
    }
    return { ...article };
  },

  async getByFilter(filterId) {
    await delay(350);
    // Simulate filtered articles based on filter rules
    return articles.filter(article => {
      // Simple filtering logic for demo
      if (filterId === 1) return article.category === 'Technology';
      if (filterId === 2) return ['Business', 'Finance'].includes(article.category);
      if (filterId === 3) return ['Environment', 'Science'].includes(article.category);
      return true;
    });
  },

  async getSummary() {
    await delay(300);
    return {
      totalArticles: articles.length,
      todayArticles: Math.floor(articles.length * 0.3),
      categories: [...new Set(articles.map(a => a.category))],
      topSources: [...new Set(articles.map(a => a.sourceName))]
};
  },

  async fetchFromRss(rssUrl) {
    await delay(300);
    
    try {
      // Validate URL format
      if (!rssUrl || typeof rssUrl !== 'string') {
        throw new Error('Invalid RSS URL provided');
      }
      
      // Basic URL validation
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(rssUrl)) {
        throw new Error('RSS URL must start with http:// or https://');
      }

      const feed = await parser.parseURL(rssUrl);
      const newArticles = [];

      for (const item of feed.items) {
        const articleId = nextId++;
        
        // Extract image URL from various possible sources
        let imageUrl = null;
        if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
          imageUrl = item['media:content'].$.url;
        } else if (item['media:thumbnail'] && item['media:thumbnail'].$ && item['media:thumbnail'].$.url) {
          imageUrl = item['media:thumbnail'].$.url;
        } else if (item.enclosure && item.enclosure.url) {
          imageUrl = item.enclosure.url;
        }

        const article = {
          Id: articleId,
          title: item.title || 'Untitled',
          content: item.contentSnippet || item.content || item.summary || '',
          url: item.link || '',
          publishDate: item.pubDate || item.isoDate || new Date().toISOString(),
          category: this.categorizeArticle(item.title + ' ' + (item.contentSnippet || '')),
          sourceName: feed.title || 'RSS Feed',
          sourceId: 1, // Default source ID for RSS feeds
          imageUrl: imageUrl,
          readTime: Math.ceil((item.contentSnippet || '').split(' ').length / 200),
          author: item.creator || item.author || 'Unknown'
        };

        newArticles.push(article);
      }

      // Add to articles array
      articles = [...newArticles, ...articles];
      
      return newArticles;
    } catch (error) {
      console.error('RSS fetch error:', error);
      throw new Error(`Failed to fetch RSS feed: ${error.message}`);
    }
  },

  async fetchAllRssFeeds() {
    await delay(200);
    
    try {
      // Import feed sources to get RSS URLs
      const { feedSourceService } = await import('./feedSourceService.js');
      const feedSources = await feedSourceService.getAll();
      
      const allNewArticles = [];
      
      for (const source of feedSources) {
        if (source.url && source.status === 'active') {
          try {
            const articles = await this.fetchFromRss(source.url);
            allNewArticles.push(...articles);
          } catch (error) {
            console.warn(`Failed to fetch from ${source.name}:`, error.message);
          }
        }
      }
      
      return allNewArticles;
    } catch (error) {
      console.error('Failed to fetch RSS feeds:', error);
      throw new Error('Failed to fetch RSS feeds');
    }
  },

  categorizeArticle(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('tech') || lowerText.includes('software') || lowerText.includes('ai') || lowerText.includes('digital')) {
      return 'Technology';
    } else if (lowerText.includes('business') || lowerText.includes('market') || lowerText.includes('economy')) {
      return 'Business';
    } else if (lowerText.includes('health') || lowerText.includes('medical') || lowerText.includes('wellness')) {
      return 'Health';
    } else if (lowerText.includes('environment') || lowerText.includes('climate') || lowerText.includes('green')) {
      return 'Environment';
    } else if (lowerText.includes('science') || lowerText.includes('research') || lowerText.includes('study')) {
      return 'Science';
    } else if (lowerText.includes('finance') || lowerText.includes('money') || lowerText.includes('investment')) {
      return 'Finance';
    }
    
    return 'Technology'; // Default category
  }
};