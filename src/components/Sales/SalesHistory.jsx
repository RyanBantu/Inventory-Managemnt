import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import DesignerCard from './DesignerCard';
import { X, Calendar, FileText, DollarSign, TrendingUp } from 'lucide-react';
import { formatDate, calculateTotal } from '../../utils/helpers';
import { theme } from '../../theme';

const c = theme.colors;

const SalesHistory = () => {
  const { sales, getSalesByDesigner } = useApp();
  const [selectedDesigner, setSelectedDesigner] = useState(null);
  const designers = [...new Set(sales.map(sale => sale.designerName))];
  const selectedSales = selectedDesigner ? getSalesByDesigner(selectedDesigner) : [];

  const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '24px' },
    header: { marginBottom: '24px' },
    title: { fontSize: '36px', fontWeight: '800', color: c.primary[900], marginBottom: '8px' },
    subtitle: { fontSize: '16px', color: c.neutral[500] },
    emptyState: { backgroundColor: c.neutral.white, borderRadius: '18px', padding: '64px 32px', textAlign: 'center', border: `1px solid ${c.neutral[200]}`, boxShadow: '0 1px 3px rgba(21,42,17,0.04)' },
    emptyIcon: { width: '64px', height: '64px', backgroundColor: c.primary[50], borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
    emptyText: { fontSize: '18px', color: c.neutral[500], fontWeight: '500' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' },
    modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' },
    modalContent: { backgroundColor: c.neutral.white, borderRadius: '18px', maxWidth: '1024px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(21,42,17,0.25)' },
    modalHeader: { position: 'sticky', top: 0, background: `linear-gradient(135deg, ${c.primary[600]} 0%, ${c.primary[800]} 100%)`, color: c.neutral.white, padding: '24px', borderRadius: '18px 18px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 },
    modalTitle: { fontSize: '28px', fontWeight: '700' },
    closeBtn: { padding: '8px', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '12px', cursor: 'pointer', color: c.neutral.white },
    modalBody: { padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' },
    saleCard: { border: `1px solid ${c.neutral[200]}`, borderRadius: '18px', padding: '24px', backgroundColor: c.neutral.white, transition: 'all 0.3s ease' },
    saleHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' },
    billInfo: { display: 'flex', alignItems: 'center', gap: '12px', color: c.neutral[700], marginBottom: '12px' },
    billIcon: { padding: '8px', backgroundColor: c.primary[100], borderRadius: '8px', display: 'flex' },
    billNumber: { fontWeight: '700', fontSize: '18px', color: c.primary[900] },
    dateRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: c.neutral[500], marginBottom: '8px' },
    clientName: { fontSize: '15px', fontWeight: '600', color: c.neutral[700] },
    totalDisplay: { display: 'flex', alignItems: 'center', gap: '8px', color: c.success[600] },
    totalValue: { fontSize: '28px', fontWeight: '800' },
    productsSection: { borderTop: `1px solid ${c.neutral[200]}`, paddingTop: '24px', marginTop: '24px' },
    productsTitle: { fontWeight: '700', color: c.primary[900], marginBottom: '16px', fontSize: '18px' },
    productList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    productItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: c.neutral[50], borderRadius: '12px', border: `1px solid ${c.neutral[100]}` },
    productName: { fontWeight: '600', color: c.primary[900] },
    productDetails: { fontSize: '14px', color: c.neutral[600] },
    productTotal: { fontWeight: '700', color: c.primary[900], fontSize: '18px' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Sales History</h1>
        <p style={styles.subtitle}>View sales performance by designer</p>
      </div>
      
      {sales.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}><TrendingUp size={28} color={c.primary[400]} /></div>
          <p style={styles.emptyText}>No sales history available</p>
        </div>
      ) : (
        <>
          <div style={styles.grid}>
            {designers.map((designerName) => (
              <DesignerCard key={designerName} designerName={designerName} sales={getSalesByDesigner(designerName)} onClick={() => setSelectedDesigner(designerName)} />
            ))}
          </div>

          {selectedDesigner && (
            <div style={styles.modalOverlay} onClick={() => setSelectedDesigner(null)}>
              <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>{selectedDesigner}'s Sales</h2>
                  <button onClick={() => setSelectedDesigner(null)} style={styles.closeBtn}><X size={24} /></button>
                </div>

                <div style={styles.modalBody}>
                  {selectedSales.map((sale) => {
                    const total = calculateTotal(sale.products);
                    return (
                      <div key={sale.id} style={styles.saleCard}>
                        <div style={styles.saleHeader}>
                          <div>
                            <div style={styles.billInfo}>
                              <div style={styles.billIcon}><FileText size={20} color={c.primary[600]} /></div>
                              <span style={styles.billNumber}>Bill: {sale.billNumber}</span>
                            </div>
                            <div style={styles.dateRow}><Calendar size={16} /><span>{formatDate(sale.completedAt)}</span></div>
                            <p style={styles.clientName}>Client: {sale.clientName}</p>
                          </div>
                          <div style={styles.totalDisplay}><DollarSign size={24} /><span style={styles.totalValue}>${total.toFixed(2)}</span></div>
                        </div>

                        <div style={styles.productsSection}>
                          <h4 style={styles.productsTitle}>Products:</h4>
                          <div style={styles.productList}>
                            {sale.products.map((product) => (
                              <div key={product.productId} style={styles.productItem}>
                                <div>
                                  <p style={styles.productName}>{product.name}</p>
                                  <p style={styles.productDetails}>{product.quantity} × ${product.price.toFixed(2)}</p>
                                </div>
                                <p style={styles.productTotal}>${(product.price * product.quantity).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SalesHistory;
