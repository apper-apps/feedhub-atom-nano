import filtersData from '@/services/mockData/filters.json';

let filters = [...filtersData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const filterService = {
  async getAll() {
    await delay(300);
    return [...filters];
  },

  async getById(id) {
    await delay(200);
    const filter = filters.find(item => item.Id === parseInt(id));
    if (!filter) {
      throw new Error('Filter not found');
    }
    return { ...filter };
  },

  async create(filterData) {
    await delay(400);
    const maxId = filters.length > 0 ? Math.max(...filters.map(item => item.Id)) : 0;
    const newFilter = {
      Id: maxId + 1,
      ...filterData,
      createdBy: 'admin',
      createdDate: new Date().toISOString(),
      isActive: true
    };
    filters.push(newFilter);
    return { ...newFilter };
  },

  async update(id, filterData) {
    await delay(350);
    const index = filters.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Filter not found');
    }
    filters[index] = { ...filters[index], ...filterData };
    return { ...filters[index] };
  },

  async delete(id) {
    await delay(250);
    const index = filters.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Filter not found');
    }
    filters.splice(index, 1);
    return true;
  }
};