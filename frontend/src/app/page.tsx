import Link from 'next/link';
import { Users, UserPlus, BarChart3, TrendingUp, MapPin, Building2, Sparkles, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const stats = [
    { label: 'Total Buyers', value: '1,234', change: '+12%', icon: Users, color: 'primary' },
    { label: 'Active Leads', value: '856', change: '+8%', icon: UserPlus, color: 'success' },
    { label: 'Conversions', value: '234', change: '+15%', icon: TrendingUp, color: 'accent' },
    { label: 'Revenue', value: '₹45.2L', change: '+22%', icon: BarChart3, color: 'warning' },
  ];

  const cityData = [
    { city: 'Chandigarh', buyers: 456, percentage: 37, color: 'var(--primary)' },
    { city: 'Mohali', buyers: 324, percentage: 26, color: 'var(--accent)' },
    { city: 'Zirakpur', buyers: 234, percentage: 19, color: 'var(--success)' },
    { city: 'Panchkula', buyers: 156, percentage: 13, color: 'var(--warning)' },
    { city: 'Other', buyers: 64, percentage: 5, color: 'var(--secondary)' },
  ];

  const recentActivity = [
    { action: 'New buyer registered', name: 'Rajesh Kumar', time: '2 minutes ago', type: 'new' },
    { action: 'Lead converted', name: 'Priya Sharma', time: '15 minutes ago', type: 'converted' },
    { action: 'Profile updated', name: 'Amit Singh', time: '1 hour ago', type: 'updated' },
    { action: 'New inquiry', name: 'Neha Gupta', time: '2 hours ago', type: 'inquiry' },
  ];

  return (
    <div className="app-background min-h-screen">
      <div className="relative z-10">
        {/* Premium Header */}
        <header className="glass-card mx-8 mt-8 mb-12 animate-fade-in-up">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="heading-lg">ESahayak</h1>
                <p className="text-secondary mt-2 font-medium">Premium Buyer Lead Management System</p>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/buyers" className="btn-secondary">
                  <Users className="w-5 h-5" />
                  View All Buyers
                </Link>
                <Link href="/buyers/new" className="btn-primary">
                  <UserPlus className="w-5 h-5" />
                  Add New Buyer
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="px-8 space-y-16">
          {/* Hero Section */}
          <section className="text-center py-20 animate-fade-in-up">
            <div className="inline-flex items-center px-6 py-3 glass-card mb-8">
              <Sparkles className="w-5 h-5 text-primary mr-2" />
              <span className="text-primary font-semibold">Premium Real Estate CRM</span>
            </div>
            <h2 className="heading-xl mb-8">
              Manage Your Buyer Leads
              <br />
              <span className="text-primary">Like Never Before</span>
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto mb-12 leading-relaxed">
              Transform your real estate business with our sophisticated buyer lead management platform. 
              Track, convert, and scale your operations with enterprise-grade tools.
            </p>
            <div className="flex items-center justify-center gap-6">
              <Link href="/buyers" className="btn-primary">
                <BarChart3 className="w-5 h-5" />
                Explore Dashboard
              </Link>
              <Link href="/buyers/new" className="btn-outline">
                <UserPlus className="w-5 h-5" />
                Add First Buyer
              </Link>
            </div>
          </section>

          {/* Quick Stats */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="glass-card p-6">
                <div className="flex items-center gap-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                    <p className="text-secondary text-sm">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Main Dashboard Grid */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* City Analytics */}
            <div className="xl:col-span-2 glass-card p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="heading-md flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-primary" />
                  Buyer Distribution by City
                </h3>
                <Link href="/buyers" className="text-primary hover:text-primary-light font-medium flex items-center gap-2 group">
                  View Details
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="space-y-6">
                {cityData.map((city, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-4 h-4 rounded-full shadow-lg"
                          style={{ backgroundColor: city.color, boxShadow: `0 0 12px ${city.color}40` }}
                        ></div>
                        <span className="font-semibold text-white text-lg">{city.city}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white text-lg">{city.buyers}</div>
                        <div className="text-secondary text-sm">{city.percentage}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-surface-light rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${city.percentage}%`,
                          background: `linear-gradient(90deg, ${city.color}, ${city.color}80)`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="glass-card p-8">
              <h3 className="heading-md mb-8 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-success" />
                Live Activity
              </h3>
              <div className="space-y-6">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-surface-light/50 transition-colors group">
                    <div className={`w-3 h-3 rounded-full mt-2 shadow-lg ${
                      activity.type === 'new' ? 'bg-success shadow-emerald-500/50' :
                      activity.type === 'converted' ? 'bg-primary shadow-indigo-500/50' :
                      activity.type === 'updated' ? 'bg-warning shadow-amber-500/50' :
                      'bg-accent shadow-cyan-500/50'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium mb-1">{activity.action}</p>
                      <p className="text-primary font-semibold mb-1">{activity.name}</p>
                      <p className="text-muted text-sm">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/buyers" className="block text-center text-primary hover:text-primary-light font-semibold mt-8 pt-6 border-t border-border group">
                <span className="flex items-center justify-center gap-2">
                  View All Activity
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </section>

          {/* Feature Showcase */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16">
            <div className="glass-card p-10 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h3 className="heading-md mb-4">Lead Management</h3>
              <p className="text-secondary mb-6 leading-relaxed">
                Centralize and streamline your buyer lead pipeline with advanced tracking and automation tools.
              </p>
              <Link href="/buyers" className="btn-outline">
                Get Started
              </Link>
            </div>

            <div className="glass-card p-6 text-center">
              <BarChart3 className="w-12 h-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">CSV Import/Export</h3>
              <p className="text-secondary text-sm mb-4">
                Bulk import and export buyer data via CSV files (max 200 rows)
              </p>
              <Link href="/buyers/import" className="btn-outline text-sm px-4 py-2">
                Import Data
              </Link>
            </div>

            <div className="glass-card p-6 text-center">
              <Building2 className="w-12 h-12 text-warning mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Property Types</h3>
              <p className="text-secondary text-sm mb-4">
                Support for apartments, villas, plots, and commercial spaces
              </p>
              <Link href="/buyers/new" className="btn-outline text-sm px-4 py-2">
                Add Buyer
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
