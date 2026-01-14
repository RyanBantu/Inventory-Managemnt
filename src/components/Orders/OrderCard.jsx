import { useState } from 'react';
import { Calendar, ArrowRight, Package, ShoppingBag } from 'lucide-react';
import { formatDate, calculateTotal } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';
import { theme } from '../../theme';

const c = theme.colors;

const OrderCard = ({ order, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { inventory } = useApp();
  const total = calculateTotal(order.products);

  // Get product details with inventory info
  const getProductWithInventory = (orderProduct) => {
    const inventoryProduct = inventory.find(p => p.id === orderProduct.productId);
    return {
      ...orderProduct,
      inventoryQty: inventoryProduct?.inventoryQuantity || inventoryProduct?.quantity || 0,
      orderedQty: inventoryProduct?.orderedQuantity || 0,
    };
  };

  const productsWithInventory = order.products.slice(0, 3).map(getProductWithInventory);
  const moreProducts = order.products.length > 3 ? order.products.length - 3 : 0;
  const totalItems = order.products.reduce((sum, p) => sum + p.quantity, 0);

  const styles = {
    card: { backgroundColor: c.neutral.white, borderRadius: '14px', border: `1px solid ${isHovered ? c.primary[300] : c.neutral[200]}`, boxShadow: isHovered ? `0 8px 24px ${c.primary[900]}12` : '0 1px 3px rgba(21,42,17,0.04)', cursor: 'pointer', transition: 'all 0.2s ease', overflow: 'hidden' },
    cardBody: { padding: '18px' },
    header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' },
    headerLeft: { flex: 1, minWidth: 0 },
    designerName: { fontSize: '16px', fontWeight: '700', color: c.primary[900], marginBottom: '4px' },
    clientRow: { fontSize: '13px', color: c.neutral[600] },
    clientName: { fontWeight: '600', color: c.neutral[800] },
    arrow: { color: c.primary[500], transition: 'transform 0.2s ease', transform: isHovered ? 'translateX(3px)' : 'translateX(0)' },
    productsSection: { marginBottom: '14px' },
    sectionLabel: { fontSize: '11px', fontWeight: '600', color: c.neutral[500], textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '8px' },
    productsList: { display: 'flex', flexDirection: 'column', gap: '6px' },
    productItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', backgroundColor: c.neutral[50], borderRadius: '8px', border: `1px solid ${c.neutral[100]}` },
    productIcon: { width: '28px', height: '28px', backgroundColor: c.primary[100], borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    productInfo: { flex: 1, minWidth: 0 },
    productName: { fontSize: '13px', fontWeight: '600', color: c.neutral[800], whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    productMeta: { display: 'flex', gap: '8px', marginTop: '2px' },
    productQty: { fontSize: '11px', color: c.neutral[500] },
    inventoryBadge: (qty) => ({ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: '600', backgroundColor: qty < 10 ? c.warning[100] : c.success[100], color: qty < 10 ? c.warning[700] : c.success[700] }),
    moreProducts: { fontSize: '12px', color: c.primary[600], fontWeight: '500', padding: '6px 0', textAlign: 'center' },
    footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', backgroundColor: c.neutral[50], borderTop: `1px solid ${c.neutral[100]}` },
    footerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
    dateRow: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: c.neutral[500] },
    itemsBadge: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600', color: c.primary[700], backgroundColor: c.primary[50], padding: '4px 8px', borderRadius: '6px' },
    totalSection: { textAlign: 'right' },
    totalLabel: { fontSize: '10px', color: c.neutral[500], marginBottom: '2px' },
    totalValue: { fontSize: '18px', fontWeight: '700', color: c.primary[700] },
  };

  return (
    <div onClick={onClick} style={styles.card} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div style={styles.cardBody}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h3 style={styles.designerName}>{order.designerName}</h3>
            <p style={styles.clientRow}>Client: <span style={styles.clientName}>{order.clientName}</span></p>
          </div>
          <ArrowRight size={18} style={styles.arrow} />
        </div>
        
        <div style={styles.productsSection}>
          <div style={styles.sectionLabel}>Products</div>
          <div style={styles.productsList}>
            {productsWithInventory.map((product, idx) => (
              <div key={idx} style={styles.productItem}>
                <div style={styles.productIcon}><Package size={14} color={c.primary[600]} /></div>
                <div style={styles.productInfo}>
                  <div style={styles.productName} title={product.name}>{product.name}</div>
                  <div style={styles.productMeta}>
                    <span style={styles.productQty}>Qty: {product.quantity}</span>
                    <span style={styles.inventoryBadge(product.inventoryQty)}>Stock: {product.inventoryQty}</span>
                  </div>
                </div>
              </div>
            ))}
            {moreProducts > 0 && <div style={styles.moreProducts}>+{moreProducts} more product{moreProducts > 1 ? 's' : ''}</div>}
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <div style={styles.footerLeft}>
          <div style={styles.dateRow}><Calendar size={14} />{formatDate(order.createdAt)}</div>
          <div style={styles.itemsBadge}><ShoppingBag size={12} />{totalItems} items</div>
        </div>
        <div style={styles.totalSection}>
          <div style={styles.totalLabel}>Total</div>
          <div style={styles.totalValue}>${total.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
