import webhooksData from '@/services/mockData/webhooks.json';

let webhooks = [...webhooksData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const webhookService = {
  async getAll() {
    await delay(300);
    return [...webhooks];
  },

  async getById(id) {
    await delay(200);
    const webhook = webhooks.find(item => item.Id === parseInt(id));
    if (!webhook) {
      throw new Error('Webhook not found');
    }
    return { ...webhook };
  },

  async create(webhookData) {
    await delay(400);
    const maxId = webhooks.length > 0 ? Math.max(...webhooks.map(item => item.Id)) : 0;
    const newWebhook = {
      Id: maxId + 1,
      ...webhookData,
      lastTriggered: null,
      successCount: 0,
      errorCount: 0
    };
    webhooks.push(newWebhook);
    return { ...newWebhook };
  },

  async update(id, webhookData) {
    await delay(350);
    const index = webhooks.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Webhook not found');
    }
    webhooks[index] = { ...webhooks[index], ...webhookData };
    return { ...webhooks[index] };
  },

  async delete(id) {
    await delay(250);
    const index = webhooks.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Webhook not found');
    }
    webhooks.splice(index, 1);
    return true;
  },

  async test(id) {
    await delay(500);
    const webhook = webhooks.find(item => item.Id === parseInt(id));
    if (!webhook) {
      throw new Error('Webhook not found');
    }
    
    // Simulate webhook test
    const success = Math.random() > 0.2; // 80% success rate
    if (!success) {
      throw new Error('Webhook test failed - unable to reach endpoint');
    }
    
    return {
      success: true,
      response: 'OK',
      responseTime: Math.floor(Math.random() * 500) + 100
    };
  }
};