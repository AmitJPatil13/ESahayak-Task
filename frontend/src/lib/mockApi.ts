import { BuyerType, BuyerCreateType, BuyerUpdateType, BuyerFiltersType, BuyerListResponseType, UserType, BuyerHistoryType } from './zod-schemas';

// Mock data store
let mockBuyers: BuyerType[] = [
  {
    id: '1',
    fullName: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '9876543210',
    city: 'Chandigarh',
    propertyType: 'Apartment',
    bhk: '3',
    purpose: 'Buy',
    budgetMin: 5000000,
    budgetMax: 7000000,
    timeline: '3-6m',
    source: 'Website',
    status: 'New',
    notes: 'Looking for a 3BHK apartment in Sector 22',
    tags: ['urgent', 'family'],
    ownerId: 'demo-user-1',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '9876543211',
    city: 'Mohali',
    propertyType: 'Villa',
    bhk: '4',
    purpose: 'Buy',
    budgetMin: 8000000,
    budgetMax: 12000000,
    timeline: '0-3m',
    source: 'Referral',
    status: 'Qualified',
    notes: 'Prefers independent villa with parking',
    tags: ['premium', 'villa'],
    ownerId: 'demo-user-1',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    fullName: 'Amit Singh',
    phone: '9876543212',
    city: 'Zirakpur',
    propertyType: 'Plot',
    purpose: 'Buy',
    budgetMin: 2000000,
    budgetMax: 3000000,
    timeline: '>6m',
    source: 'Walk-in',
    status: 'Contacted',
    notes: 'Looking for residential plot for future construction',
    tags: ['investment'],
    ownerId: 'demo-user-1',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    fullName: 'Sunita Gupta',
    email: 'sunita@example.com',
    phone: '9876543213',
    city: 'Panchkula',
    propertyType: 'Apartment',
    bhk: '2',
    purpose: 'Rent',
    budgetMin: 25000,
    budgetMax: 35000,
    timeline: '0-3m',
    source: 'Call',
    status: 'Visited',
    notes: 'Needs furnished 2BHK near IT park',
    tags: ['furnished', 'IT-park'],
    ownerId: 'demo-user-1',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '5',
    fullName: 'Vikram Mehta',
    email: 'vikram.mehta@example.com',
    phone: '9876543214',
    city: 'Chandigarh',
    propertyType: 'Office',
    purpose: 'Rent',
    budgetMin: 50000,
    budgetMax: 80000,
    timeline: '3-6m',
    source: 'Website',
    status: 'Negotiation',
    notes: 'Commercial space for IT company',
    tags: ['commercial', 'IT'],
    ownerId: 'demo-user-1',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date(Date.now() - 345600000).toISOString(),
  },
];

let mockHistory: BuyerHistoryType[] = [
  {
    id: 'h1',
    buyerId: '1',
    changedBy: 'demo-user-1',
    changedAt: new Date(Date.now() - 86400000).toISOString(),
    diff: { status: { from: 'New', to: 'New' } },
  },
  {
    id: 'h2',
    buyerId: '2',
    changedBy: 'demo-user-1',
    changedAt: new Date(Date.now() - 86400000).toISOString(),
    diff: { status: { from: 'New', to: 'Qualified' } },
  },
];

const mockUser: UserType = {
  id: 'demo-user-1',
  email: 'demo@example.com',
  name: 'Demo User',
  isAdmin: false,
  createdAt: new Date(Date.now() - 2592000000).toISOString(),
};

// Helper functions
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function filterBuyers(buyers: BuyerType[], filters: BuyerFiltersType): BuyerType[] {
  let filtered = [...buyers];

  if (filters.city) {
    filtered = filtered.filter(buyer => buyer.city === filters.city);
  }

  if (filters.propertyType) {
    filtered = filtered.filter(buyer => buyer.propertyType === filters.propertyType);
  }

  if (filters.status) {
    filtered = filtered.filter(buyer => buyer.status === filters.status);
  }

  if (filters.timeline) {
    filtered = filtered.filter(buyer => buyer.timeline === filters.timeline);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(buyer => 
      buyer.fullName.toLowerCase().includes(searchLower) ||
      buyer.phone.includes(filters.search!) ||
      (buyer.email && buyer.email.toLowerCase().includes(searchLower))
    );
  }

  // Sort
  const sortField = filters.sort || 'updatedAt';
  const order = filters.order || 'desc';
  
  filtered.sort((a, b) => {
    let aVal: any = a[sortField as keyof BuyerType];
    let bVal: any = b[sortField as keyof BuyerType];
    
    if (sortField === 'updatedAt' || sortField === 'createdAt') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }
    
    if (order === 'desc') {
      return bVal > aVal ? 1 : -1;
    }
    return aVal > bVal ? 1 : -1;
  });

  return filtered;
}

// Mock API functions
export const mockApi = {
  // Auth
  async demoLogin(): Promise<{ user: UserType; token: string }> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return {
      user: mockUser,
      token: 'mock-jwt-token',
    };
  },

  // Buyers CRUD
  async getBuyers(filters: BuyerFiltersType = {}): Promise<BuyerListResponseType> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const filtered = filterBuyers(mockBuyers, filters);
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      items: filtered.slice(startIndex, endIndex),
      total: filtered.length,
      page,
      pageSize,
    };
  },

  async getBuyer(id: string): Promise<{ buyer: BuyerType; history: BuyerHistoryType[] } | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const buyer = mockBuyers.find(b => b.id === id);
    if (!buyer) return null;
    
    const history = mockHistory.filter(h => h.buyerId === id).slice(0, 5);
    return { buyer, history };
  },

  async createBuyer(data: BuyerCreateType): Promise<BuyerType> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newBuyer: BuyerType = {
      ...data,
      id: generateId(),
      ownerId: mockUser.id,
      status: data.status || 'New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockBuyers.unshift(newBuyer);
    
    // Add history entry
    const historyEntry: BuyerHistoryType = {
      id: generateId(),
      buyerId: newBuyer.id,
      changedBy: mockUser.id,
      changedAt: new Date().toISOString(),
      diff: { created: true },
    };
    mockHistory.unshift(historyEntry);
    
    return newBuyer;
  },

  async updateBuyer(id: string, data: BuyerUpdateType): Promise<BuyerType> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const buyerIndex = mockBuyers.findIndex(b => b.id === id);
    if (buyerIndex === -1) {
      throw new Error('Buyer not found');
    }
    
    const existingBuyer = mockBuyers[buyerIndex];
    
    // Simulate concurrency check
    if (data.updatedAt !== existingBuyer.updatedAt) {
      throw new Error('CONFLICT: Record has been modified by another user. Please refresh and try again.');
    }
    
    const updatedBuyer: BuyerType = {
      ...existingBuyer,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    mockBuyers[buyerIndex] = updatedBuyer;
    
    // Add history entry
    const changes: Record<string, any> = {};
    Object.keys(data).forEach(key => {
      if (key !== 'id' && key !== 'updatedAt' && (data as any)[key] !== (existingBuyer as any)[key]) {
        changes[key] = {
          from: (existingBuyer as any)[key],
          to: (data as any)[key],
        };
      }
    });
    
    if (Object.keys(changes).length > 0) {
      const historyEntry: BuyerHistoryType = {
        id: generateId(),
        buyerId: id,
        changedBy: mockUser.id,
        changedAt: new Date().toISOString(),
        diff: changes,
      };
      mockHistory.unshift(historyEntry);
    }
    
    return updatedBuyer;
  },

  async deleteBuyer(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const buyerIndex = mockBuyers.findIndex(b => b.id === id);
    if (buyerIndex === -1) {
      throw new Error('Buyer not found');
    }
    
    mockBuyers.splice(buyerIndex, 1);
    
    // Remove history entries
    mockHistory = mockHistory.filter(h => h.buyerId !== id);
  },

  // CSV Import/Export
  async importBuyers(csvData: string): Promise<{ inserted: number; errors: Array<{ row: number; message: string }> }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    if (lines.length > 201) { // 1 header + 200 data rows
      throw new Error('CSV file cannot exceed 200 rows');
    }
    
    const errors: Array<{ row: number; message: string }> = [];
    let inserted = 0;
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim());
        const rowData: any = {};
        
        headers.forEach((header, index) => {
          if (values[index]) {
            rowData[header] = values[index];
          }
        });
        
        // Convert numeric fields
        if (rowData.budgetMin) rowData.budgetMin = parseInt(rowData.budgetMin);
        if (rowData.budgetMax) rowData.budgetMax = parseInt(rowData.budgetMax);
        if (rowData.tags) rowData.tags = rowData.tags.split(';').filter(Boolean);
        
        // Validate with Zod (simplified validation)
        if (!rowData.fullName || rowData.fullName.length < 2) {
          errors.push({ row: i + 1, message: 'fullName must be at least 2 characters' });
          continue;
        }
        
        if (!rowData.phone || !/^\d{10,15}$/.test(rowData.phone)) {
          errors.push({ row: i + 1, message: 'phone must be 10-15 digits' });
          continue;
        }
        
        // Create buyer
        await this.createBuyer(rowData);
        inserted++;
        
      } catch (error) {
        errors.push({ row: i + 1, message: (error as Error).message });
      }
    }
    
    return { inserted, errors };
  },

  async exportBuyers(filters: BuyerFiltersType = {}): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const filtered = filterBuyers(mockBuyers, filters);
    
    const headers = [
      'fullName', 'email', 'phone', 'city', 'propertyType', 'bhk', 'purpose',
      'budgetMin', 'budgetMax', 'timeline', 'source', 'notes', 'tags', 'status'
    ];
    
    let csv = headers.join(',') + '\n';
    
    filtered.forEach(buyer => {
      const row = headers.map(header => {
        let value = (buyer as any)[header] || '';
        if (header === 'tags' && Array.isArray(value)) {
          value = value.join(';');
        }
        return `"${value}"`;
      });
      csv += row.join(',') + '\n';
    });
    
    return csv;
  },
};

// Server-side functions for SSR
export const mockServerApi = {
  async getBuyers(filters: BuyerFiltersType = {}): Promise<BuyerListResponseType> {
    // Simulate server-side data fetching
    return mockApi.getBuyers(filters);
  },
};
