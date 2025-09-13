// Real API client to replace mock data
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async demoLogin(email: string, password: string) {
    const response = await this.request('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.token = response.token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  }

  // Buyers
  async getBuyers(params: {
    page?: number;
    limit?: number;
    search?: string;
    city?: string;
    propertyType?: string;
    status?: string;
    timeline?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    return this.request(`/buyers?${searchParams}`);
  }

  async getBuyer(id: string) {
    return this.request(`/buyers/${id}`);
  }

  async createBuyer(data: any) {
    return this.request('/buyers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBuyer(id: string, data: any) {
    return this.request(`/buyers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBuyer(id: string) {
    return this.request(`/buyers/${id}`, {
      method: 'DELETE',
    });
  }

  async importBuyers(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request('/buyers/import', {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    });
  }

  async exportBuyers(params: any = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/buyers/export?${searchParams}`, {
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  }
}

export const apiClient = new ApiClient();
