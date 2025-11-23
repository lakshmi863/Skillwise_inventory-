import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Package, AlertTriangle, Layers, BarChart3 } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import '../App.css';

const HomePage = () => {
  // 1. Initial State
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStock: 0,
    categories: 0,
    categoryDistribution: [], // Array for Pie Chart
    lowStockItems: []         // Array for Bar Chart
  });

  // 2. Fetch Data on Load
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };
    fetchStats();
  }, []);

  // Professional Colors for the Pie Chart Slices
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="home-container">
      <h2>Dashboard Overview</h2>
      
      {/* --- STATS CARDS (TOP ROW) --- */}
      <div className="stats-grid">
        
        <div className="stat-card blue">
          <div className="icon-wrapper"><Package size={24} /></div>
          <div>
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="icon-wrapper"><Layers size={24} /></div>
          <div>
            <h3>{stats.totalStock}</h3>
            <p>Total Quantity</p>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="icon-wrapper"><BarChart3 size={24} /></div>
          <div>
            <h3>{stats.categories}</h3>
            <p>Categories</p>
          </div>
        </div>

        <div className="stat-card red">
          <div className="icon-wrapper"><AlertTriangle size={24} /></div>
          <div>
            <h3>{stats.lowStock}</h3>
            <p>Low Stock Alerts</p>
          </div>
        </div>

      </div>

      {/* --- CHARTS SECTION (MIDDLE ROW) --- */}
      <div className="charts-container">
        
        {/* CHART 1: PIE CHART (Categories) */}
        <div className="chart-card">
          <h3>Inventory by Category</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={stats.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"     // The number value
                  nameKey="category"  // The text label (Fixes the Legend!)
                >
                  {stats.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: BAR CHART (Low Stock) */}
        <div className="chart-card">
          <h3>Lowest Stock Items</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart 
                data={stats.lowStockItems} 
                layout="vertical" 
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}}/>
                <RechartsTooltip cursor={{fill: 'transparent'}} />
                <Bar 
                  dataKey="stock" 
                  fill="#EF4444" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20} 
                  name="Stock Level"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* --- WELCOME BANNER (BOTTOM) --- */}
      <div className="welcome-banner">
        <h3>Welcome to your Inventory System</h3>
        <p>Use the navigation sidebar to manage products, track stock levels, and view history logs.</p>
      </div>
    </div>
  );
};

export default HomePage;