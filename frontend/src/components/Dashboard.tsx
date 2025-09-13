'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  MapPin, 
  Phone,
  Mail,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { mockApi } from '@/lib/mockApi';

interface DashboardStats {
  totalBuyers: number;
  activeBuyers: number;
  totalValue: number;
  avgBudget: number;
  recentActivity: number;
  conversionRate: number;
}

interface CityStats {
  city: string;
  count: number;
  percentage: number;
}

interface StatusStats {
  status: string;
  count: number;
  color: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBuyers: 0,
    activeBuyers: 0,
    totalValue: 0,
    avgBudget: 0,
    recentActivity: 0,
    conversionRate: 0
  });
  const [cityStats, setCityStats] = useState<CityStats[]>([]);
  const [statusStats, setStatusStats] = useState<StatusStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await mockApi.getBuyers({ page: 1, pageSize: 1000 });
        const buyers = response.items;

        // Calculate stats
        const totalBuyers = buyers.length;
        const activeBuyers = buyers.filter(b => b.status === 'active').length;
        const totalValue = buyers.reduce((sum, b) => sum + (b.budget || 0), 0);
        const avgBudget = totalValue / totalBuyers || 0;
        const recentActivity = buyers.filter(b => {
          const createdDate = new Date(b.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return createdDate > weekAgo;
        }).length;
        const conversionRate = (activeBuyers / totalBuyers) * 100 || 0;

        setStats({
          totalBuyers,
          activeBuyers,
          totalValue,
          avgBudget,
          recentActivity,
          conversionRate
        });

        // City distribution
        const cityCount: { [key: string]: number } = {};
        buyers.forEach(buyer => {
          const city = buyer.city || 'Unknown';
          cityCount[city] = (cityCount[city] || 0) + 1;
        });

        const cityData = Object.entries(cityCount)
          .map(([city, count]) => ({
            city,
            count,
            percentage: (count / totalBuyers) * 100
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setCityStats(cityData);

        // Status distribution
        const statusCount: { [key: string]: number } = {};
        buyers.forEach(buyer => {
          const status = buyer.status || 'unknown';
          statusCount[status] = (statusCount[status] || 0) + 1;
        });

        const statusColors: { [key: string]: string } = {
          active: 'bg-green-500',
          inactive: 'bg-gray-500',
          pending: 'bg-yellow-500',
          converted: 'bg-blue-500'
        };

        const statusData = Object.entries(statusCount).map(([status, count]) => ({
          status: status.charAt(0).toUpperCase() + status.slice(1),
          count,
          color: statusColors[status] || 'bg-gray-400'
        }));

        setStatusStats(statusData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Buyers</p>
              <p className="text-3xl font-bold gradient-text">{stats.totalBuyers}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+12% from last month</span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Buyers</p>
              <p className="text-3xl font-bold gradient-text">{stats.activeBuyers}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">
              {stats.conversionRate.toFixed(1)}% conversion rate
            </span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-3xl font-bold gradient-text">
                ₹{(stats.totalValue / 10000000).toFixed(1)}Cr
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">
              Avg: ₹{(stats.avgBudget / 100000).toFixed(1)}L
            </span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent Activity</p>
              <p className="text-3xl font-bold gradient-text">{stats.recentActivity}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">Last 7 days</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* City Distribution */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center mb-6">
            <MapPin className="w-5 h-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Top Cities</h3>
          </div>
          <div className="space-y-4">
            {cityStats.map((city, index) => (
              <div key={city.city} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 bg-gradient-to-r ${
                    index === 0 ? 'from-blue-500 to-indigo-500' :
                    index === 1 ? 'from-green-500 to-emerald-500' :
                    index === 2 ? 'from-purple-500 to-pink-500' :
                    index === 3 ? 'from-orange-500 to-red-500' :
                    'from-gray-400 to-gray-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">{city.city}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">{city.count}</span>
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                      style={{ width: `${city.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">{city.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center mb-6">
            <BarChart3 className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Status Overview</h3>
          </div>
          <div className="space-y-4">
            {statusStats.map((status) => (
              <div key={status.status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${status.color}`}></div>
                  <span className="text-sm font-medium text-gray-700">{status.status}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-gray-900">{status.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary flex items-center justify-center gap-2 py-3">
            <Users className="w-4 h-4" />
            View All Buyers
          </button>
          <button className="btn-secondary flex items-center justify-center gap-2 py-3">
            <Phone className="w-4 h-4" />
            Follow Up Calls
          </button>
          <button className="btn-secondary flex items-center justify-center gap-2 py-3">
            <Mail className="w-4 h-4" />
            Send Updates
          </button>
        </div>
      </div>
    </div>
  );
}
