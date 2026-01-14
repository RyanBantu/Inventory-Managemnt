import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import OrderCard from './OrderCard';
import { ClipboardList, Clock, CheckCircle2, Package } from 'lucide-react';
import { theme } from '../../theme';

const c = theme.colors;

const OrdersList = () => {
  const navigate = useNavigate();
  const { orders, sales } = useApp();
  const [activeTab, setActiveTab] = useState('pending');

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const paidOrders = orders.filter(order => order.status === 'paid');
  const completedOrders = sales;

  const tabs = [
    { id: 'pending', label: 'Pending', count: pendingOrders.length, icon: Clock },
    { id: 'paid', label: 'Paid (Fulfilling)', count: paidOrders.length, icon: Package },
    { id: 'completed', label: 'Completed', count: completedOrders.length, icon: CheckCircle2 },
  ];

  const getCurrentOrders = () => {
    switch (activeTab) {
      case 'pending':
        return pendingOrders;
      case 'paid':
        return paidOrders;
      case 'completed':
        return completedOrders;
      default:
        return [];
    }
  };

  const currentOrders = getCurrentOrders();

  const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '20px' },
    header: { marginBottom: '4px' },
    title: { fontSize: '26px', fontWeight: '700', color: c.primary[900], marginBottom: '4px' },
    subtitle: { fontSize: '14px', color: c.neutral[500] },
    tabsContainer: { backgroundColor: c.neutral.white, borderRadius: '12px', padding: '6px', display: 'flex', gap: '4px', border: `1px solid ${c.neutral[200]}` },
    tab: (active) => ({ 
      flex: 1, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: '8px', 
      padding: '10px 16px', 
      borderRadius: '8px', 
      border: 'none', 
      backgroundColor: active ? c.primary[600] : 'transparent', 
      color: active ? c.neutral.white : c.neutral[600], 
      fontSize: '13px', 
      fontWeight: '600', 
      cursor: 'pointer', 
      transition: 'all 0.15s ease'
    }),
    badge: (active) => ({ 
      fontSize: '11px', 
      fontWeight: '700', 
      backgroundColor: active ? c.primary[700] : c.neutral[200], 
      color: active ? c.neutral.white : c.neutral[600], 
      padding: '2px 8px', 
      borderRadius: '10px' 
    }),
    emptyState: { backgroundColor: c.neutral.white, borderRadius: '14px', padding: '48px 32px', textAlign: 'center', border: `1px solid ${c.neutral[200]}` },
    emptyIcon: { width: '56px', height: '56px', backgroundColor: c.neutral[100], borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' },
    emptyTitle: { fontSize: '16px', color: c.neutral[600], fontWeight: '600', marginBottom: '4px' },
    emptyText: { fontSize: '13px', color: c.neutral[500] },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'pending':
        return { title: 'No pending orders', text: 'New orders will appear here' };
      case 'paid':
        return { title: 'No paid orders', text: 'Orders marked as paid are being fulfilled by employees' };
      case 'completed':
        return { title: 'No completed orders', text: 'Completed orders will appear here' };
      default:
        return { title: 'No orders', text: '' };
    }
  };

  const emptyMsg = getEmptyMessage();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Orders</h1>
        <p style={styles.subtitle}>Track orders through their lifecycle</p>
      </div>

      <div style={styles.tabsContainer}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              style={styles.tab(active)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              <span style={styles.badge(active)}>{tab.count}</span>
            </button>
          );
        })}
      </div>
      
      {currentOrders.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}><ClipboardList size={24} color={c.neutral[400]} /></div>
          <p style={styles.emptyTitle}>{emptyMsg.title}</p>
          <p style={styles.emptyText}>{emptyMsg.text}</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {currentOrders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onClick={() => navigate(activeTab === 'completed' ? `/sales` : `/orders/${order.id}`)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;
