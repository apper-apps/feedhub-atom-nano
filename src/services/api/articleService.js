import articlesData from '@/services/mockData/articles.json';

let articles = [...articlesData];

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
  }
};