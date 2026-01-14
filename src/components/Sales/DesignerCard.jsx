import { useState } from 'react';
import { TrendingUp, User, DollarSign, Package } from 'lucide-react';
import { theme } from '../../theme';

const c = theme.colors;

const DesignerCard = ({ designerName, sales, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.products.reduce((pSum, p) => pSum + (p.price * p.quantity), 0), 0);
  const totalProducts = sales.reduce((sum, sale) => sum + sale.products.reduce((pSum, p) => pSum + p.quantity, 0), 0);

  const styles = {
    card: { backgroundColor: c.neutral.white, borderRadius: '18px', padding: '24px', border: `1px solid ${isHovered ? c.primary[300] : c.neutral[200]}`, cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: isHovered ? `0 10px 30px ${c.primary[900]}15` : '0 1px 3px rgba(21,42,17,0.04)' },
    header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' },
    userSection: { display: 'flex', alignItems: 'center', gap: '16px' },
    avatar: { padding: '16px', background: `linear-gradient(135deg, ${c.primary[600]} 0%, ${c.primary[700]} 100%)`, borderRadius: '16px', color: c.neutral.white, boxShadow: `0 4px 12px ${c.primary[600]}30` },
    name: { fontSize: '24px', fontWeight: '700', color: c.primary[900], marginBottom: '4px' },
    salesCount: { fontSize: '14px', color: c.neutral[500] },
    trendIcon: { color: c.primary[500], transition: 'transform 0.3s ease', transform: isHovered ? 'scale(1.1)' : 'scale(1)' },
    statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '24px', borderTop: `1px solid ${c.neutral[100]}` },
    statBox: (bgColor, borderColor) => ({ backgroundColor: bgColor, borderRadius: '12px', padding: '16px', border: `1px solid ${borderColor}` }),
    statLabel: (color) => ({ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color, marginBottom: '8px' }),
    statValue: (color) => ({ fontSize: '24px', fontWeight: '700', color }),
  };

  return (
    <div onClick={onClick} style={styles.card} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div style={styles.header}>
        <div style={styles.userSection}>
          <div style={styles.avatar}><User size={32} /></div>
          <div>
            <h3 style={styles.name}>{designerName}</h3>
            <p style={styles.salesCount}>{sales.length} sale{sales.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <TrendingUp size={24} style={styles.trendIcon} />
      </div>
      
      <div style={styles.statsGrid}>
        <div style={styles.statBox(c.success[50], c.success[100])}>
          <div style={styles.statLabel(c.success[700])}><DollarSign size={16} /><span>Revenue</span></div>
          <p style={styles.statValue(c.success[600])}>${totalRevenue.toFixed(2)}</p>
        </div>
        <div style={styles.statBox(c.primary[50], c.primary[100])}>
          <div style={styles.statLabel(c.primary[700])}><Package size={16} /><span>Products</span></div>
          <p style={styles.statValue(c.primary[600])}>{totalProducts}</p>
        </div>
      </div>
    </div>
  );
};

export default DesignerCard;
