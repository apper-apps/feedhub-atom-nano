import feedSourcesData from '@/services/mockData/feedSources.json';

let feedSources = [...feedSourcesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const feedSourceService = {
  async getAll() {
    await delay(300);
    return [...feedSources];
  },

  async getById(id) {
    await delay(200);
    const source = feedSources.find(item => item.Id === parseInt(id));
    if (!source) {
      throw new Error('Feed source not found');
    }
    return { ...source };
  },

  async create(sourceData) {
    await delay(400);
    const maxId = feedSources.length > 0 ? Math.max(...feedSources.map(item => item.Id)) : 0;
    const newSource = {
      Id: maxId + 1,
      ...sourceData,
      status: 'active',
      lastFetch: new Date().toISOString(),
      articleCount: 0
    };
    feedSources.push(newSource);
    return { ...newSource };
  },

  async update(id, sourceData) {
    await delay(350);
    const index = feedSources.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Feed source not found');
    }
    feedSources[index] = { ...feedSources[index], ...sourceData };
    return { ...feedSources[index] };
  },

  async delete(id) {
    await delay(250);
    const index = feedSources.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Feed source not found');
    }
    feedSources.splice(index, 1);
    return true;
  },

  async testFeed(url) {
    await delay(500);
    // Simulate feed validation
    const isValid = Math.random() > 0.2; // 80% success rate
    if (!isValid) {
      throw new Error('Unable to fetch RSS feed from this URL');
    }
    return {
      valid: true,
      title: 'Sample Feed Title',
      description: 'Sample feed description',
      itemCount: Math.floor(Math.random() * 50) + 10
    };
  }
};