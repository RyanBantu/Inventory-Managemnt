import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Package, ShoppingBag, DollarSign, Clock, Plus } from 'lucide-react';
import StatsCard from './StatsCard';
import ChartCard from './ChartCard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { getStats, sales } = useApp();
  const stats = getStats();

  // Prepare chart data
  const last7Days = [];
  const last4Weeks = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const daySales = sales.filter(s => s.completedAt?.split('T')[0] === dateStr);
    const total = daySales.reduce((sum, s) => {
      return sum + s.products.reduce((pSum, p) => pSum + (p.price * p.quantity), 0);
    }, 0);
    last7Days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: total,
    });
  }

  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (i * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const weekSales = sales.filter(s => {
      const saleDate = s.completedAt?.split('T')[0];
      return saleDate >= weekStart.toISOString().split('T')[0] && 
             saleDate <= weekEnd.toISOString().split('T')[0];
    });
    const total = weekSales.reduce((sum, s) => {
      return sum + s.products.reduce((pSum, p) => pSum + (p.price * p.quantity), 0);
    }, 0);
    last4Weeks.push({
      week: `Week ${4 - i}`,
      sales: total,
    });
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Welcome back! Here's what's happening today.</p>
        </div>
        <button
          onClick={() => navigate('/add-product')}
          className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Package}
          title="Total Products"
          value={stats.totalProducts}
          subtitle="In inventory"
          color="blue"
        />
        <StatsCard
          icon={ShoppingBag}
          title="Orders"
          value={stats.weekOrders}
          subtitle={`${stats.todayOrders} today`}
          color="purple"
        />
        <StatsCard
          icon={DollarSign}
          title="Sales"
          value={`$${stats.weekSales.toFixed(2)}`}
          subtitle={`$${stats.todaySales.toFixed(2)} today`}
          color="green"
        />
        <StatsCard
          icon={Clock}
          title="Pending Orders"
          value={stats.pendingOrders}
          subtitle="Awaiting processing"
          color="amber"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Daily Sales (Last 7 Days)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b"
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                stroke="#64748b"
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly Sales (Last 4 Weeks)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last4Weeks}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="week" 
                stroke="#64748b"
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                stroke="#64748b"
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar 
                dataKey="sales" 
                fill="#60a5fa" 
                radius={[12, 12, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
