import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Package, ShoppingBag, DollarSign, Clock, Plus } from 'lucide-react';
import StatsCard from './StatsCard';
import ChartCard from './ChartCard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { theme } from '../../theme';

const c = theme.colors;

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

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '32px',
      background: `linear-gradient(135deg, ${c.primary[50]} 0%, ${c.neutral[100]} 50%, ${c.primary[100]} 100%)`,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '40px',
    },
    headerLeft: {
      flex: 1,
    },
    title: {
      fontSize: '40px',
      fontWeight: '800',
      color: c.primary[900],
      marginBottom: '8px',
      letterSpacing: '-1px',
    },
    subtitle: {
      fontSize: '16px',
      color: c.primary[700],
      fontWeight: '500',
    },
    addBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '16px 28px',
      borderRadius: '14px',
      border: 'none',
      background: `linear-gradient(135deg, ${c.primary[600]} 0%, ${c.primary[800]} 100%)`,
      color: c.neutral.white,
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: `0 6px 20px ${c.primary[600]}50`,
      transition: 'all 0.3s ease',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '28px',
      marginBottom: '40px',
    },
    chartsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '28px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Plan, prioritize, and accomplish your tasks with ease.</p>
        </div>
        <button onClick={() => navigate('/add-product')} style={styles.addBtn}>
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      <div style={styles.statsGrid}>
        <StatsCard icon={Package} title="Total Products" value={stats.totalProducts} subtitle="In inventory" color="primary" />
        <StatsCard icon={ShoppingBag} title="Orders" value={stats.weekOrders} subtitle={`${stats.todayOrders} today`} color="purple" />
        <StatsCard icon={DollarSign} title="Sales" value={`$${stats.weekSales.toFixed(2)}`} subtitle={`$${stats.todaySales.toFixed(2)} today`} color="green" />
        <StatsCard icon={Clock} title="Pending Orders" value={stats.pendingOrders} subtitle="Awaiting processing" color="amber" />
      </div>

      <div style={styles.chartsGrid}>
        <ChartCard title="Daily Sales (Last 7 Days)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke={c.neutral[200]} />
              <XAxis dataKey="date" stroke={c.neutral[500]} tick={{ fill: c.neutral[500], fontSize: 12 }} />
              <YAxis stroke={c.neutral[500]} tick={{ fill: c.neutral[500], fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: c.neutral.white, border: `1px solid ${c.neutral[200]}`, borderRadius: '10px', boxShadow: '0 4px 12px rgba(21,42,17,0.1)' }} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke={c.primary[600]} strokeWidth={3} dot={{ fill: c.primary[600], r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly Sales (Last 4 Weeks)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last4Weeks}>
              <CartesianGrid strokeDasharray="3 3" stroke={c.neutral[200]} />
              <XAxis dataKey="week" stroke={c.neutral[500]} tick={{ fill: c.neutral[500], fontSize: 12 }} />
              <YAxis stroke={c.neutral[500]} tick={{ fill: c.neutral[500], fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: c.neutral.white, border: `1px solid ${c.neutral[200]}`, borderRadius: '10px', boxShadow: '0 4px 12px rgba(21,42,17,0.1)' }} />
              <Legend />
              <Bar dataKey="sales" fill={c.primary[500]} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
