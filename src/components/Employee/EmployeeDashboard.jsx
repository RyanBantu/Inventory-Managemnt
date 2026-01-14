import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Package, Clock, User, ChevronRight } from 'lucide-react';
import { theme } from '../../theme';

const c = theme.colors;

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { orders } = useApp();
  const paidOrders = orders.filter(order => order.status === 'paid');

  const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '24px', minHeight: '100vh', padding: '24px', background: `linear-gradient(135deg, ${c.primary[50]} 0%, ${c.neutral[100]} 50%, ${c.primary[100]} 100%)` },
    header: { marginBottom: '24px' },
    title: { fontSize: '36px', fontWeight: '800', color: c.primary[900], marginBottom: '8px' },
    subtitle: { fontSize: '16px', color: c.primary[700] },
    emptyState: { backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderRadius: '18px', padding: '64px 32px', border: `2px solid ${c.primary[200]}`, textAlign: 'center', boxShadow: '0 4px 20px rgba(21,42,17,0.08)' },
    emptyIcon: { width: '64px', height: '64px', backgroundColor: c.primary[100], borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
    emptyTitle: { fontSize: '18px', fontWeight: '600', color: c.primary[700], marginBottom: '8px' },
    emptyText: { fontSize: '14px', color: c.primary[600] },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' },
    card: { background: `linear-gradient(135deg, ${c.neutral.white} 0%, ${c.primary[50]} 100%)`, borderRadius: '18px', padding: '24px', border: `2px solid ${c.primary[200]}`, cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(21,42,17,0.08)' },
    cardHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' },
    orderId: { fontSize: '20px', fontWeight: '700', color: c.primary[900], marginBottom: '4px' },
    designerRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: c.primary[700] },
    paidBadge: { background: `linear-gradient(135deg, ${c.success[500]} 0%, ${c.success[600]} 100%)`, color: c.neutral.white, padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', boxShadow: `0 2px 8px ${c.success[500]}40` },
    infoSection: { marginBottom: '16px', paddingBottom: '16px', borderBottom: `2px solid ${c.primary[200]}` },
    infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    infoLabel: { fontSize: '14px', fontWeight: '500', color: c.primary[700] },
    infoValue: { fontSize: '18px', fontWeight: '700', color: c.primary[900] },
    timeRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: c.primary[600] },
    productsSection: { marginBottom: '16px' },
    productsTitle: { fontSize: '12px', fontWeight: '600', color: c.primary[700], marginBottom: '8px' },
    productItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', backgroundColor: c.primary[100], padding: '10px 12px', borderRadius: '8px', marginBottom: '4px' },
    productName: { fontWeight: '500', color: c.primary[900] },
    productQty: { fontWeight: '700', color: c.primary[700] },
    moreText: { fontSize: '12px', color: c.primary[600], textAlign: 'center' },
    scanBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 20px', background: `linear-gradient(135deg, ${c.primary[600]} 0%, ${c.primary[700]} 100%)`, color: c.neutral.white, border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: `0 4px 12px ${c.primary[600]}30` },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Employee Dashboard</h1>
        <p style={styles.subtitle}>Scan and fulfill paid orders</p>
      </div>

      {paidOrders.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}><Package size={28} color={c.primary[400]} /></div>
          <p style={styles.emptyTitle}>No paid orders to process</p>
          <p style={styles.emptyText}>Orders marked as paid will appear here</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {paidOrders.map((order) => {
            const totalAmount = order.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
            const totalItems = order.products.reduce((sum, p) => sum + p.quantity, 0);
            return (
              <div key={order.id} style={styles.card} onClick={() => navigate(`/order-scanning/${order.id}`)}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.orderId}>Order #{order.id}</h3>
                    <div style={styles.designerRow}><User size={16} /><span>{order.designerName}</span></div>
                  </div>
                  <span style={styles.paidBadge}>PAID</span>
                </div>

                <div style={styles.infoSection}>
                  <div style={styles.infoRow}><span style={styles.infoLabel}>Total Items:</span><span style={styles.infoValue}>{totalItems}</span></div>
                  <div style={styles.infoRow}><span style={styles.infoLabel}>Total Amount:</span><span style={styles.infoValue}>${totalAmount.toFixed(2)}</span></div>
                  <div style={styles.timeRow}><Clock size={14} /><span>{new Date(order.createdAt).toLocaleString()}</span></div>
                </div>

                <div style={styles.productsSection}>
                  <p style={styles.productsTitle}>Products:</p>
                  {order.products.slice(0, 3).map((product, idx) => (
                    <div key={idx} style={styles.productItem}>
                      <span style={styles.productName}>{product.name}</span>
                      <span style={styles.productQty}>×{product.quantity}</span>
                    </div>
                  ))}
                  {order.products.length > 3 && <p style={styles.moreText}>+{order.products.length - 3} more</p>}
                </div>

                <button style={styles.scanBtn}>Start Scanning<ChevronRight size={20} /></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
