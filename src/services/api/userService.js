import usersData from '@/services/mockData/users.json';

let users = [...usersData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  async getAll() {
    await delay(300);
    return [...users];
  },

  async getById(id) {
    await delay(200);
    const user = users.find(item => item.Id === parseInt(id));
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  },

  async create(userData) {
    await delay(400);
    const maxId = users.length > 0 ? Math.max(...users.map(item => item.Id)) : 0;
    const newUser = {
      Id: maxId + 1,
      ...userData,
      role: 'user',
      isApproved: false,
      assignedFilters: [],
      apiKey: null,
      registrationDate: new Date().toISOString(),
      lastActive: null
    };
    users.push(newUser);
    return { ...newUser };
  },

  async update(id, userData) {
    await delay(350);
    const index = users.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('User not found');
    }
    users[index] = { ...users[index], ...userData };
    return { ...users[index] };
  },

  async approve(id) {
    await delay(300);
    const index = users.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('User not found');
    }
    users[index].isApproved = true;
    users[index].apiKey = `ak_${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    return { ...users[index] };
  },

  async delete(id) {
    await delay(250);
    const index = users.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('User not found');
    }
    users.splice(index, 1);
    return true;
  },

  async generateApiKey(id) {
    await delay(300);
    const index = users.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('User not found');
    }
    users[index].apiKey = `ak_${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    return { ...users[index] };
  }
};