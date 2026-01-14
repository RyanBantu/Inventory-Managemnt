import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Package, Search, X, Printer, TrendingUp, AlertCircle, Boxes, DollarSign } from 'lucide-react';
import { printBarcode } from '../../utils/barcodePrinter';
import { theme } from '../../theme';

const c = theme.colors;

const Products = () => {
  const { inventory } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [printingId, setPrintingId] = useState(null);
  const [printError, setPrintError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleReprint = async (product) => {
    setPrintingId(product.id);
    setPrintError(null);
    try {
      await printBarcode(product.id, product.name, product.inventoryQuantity || product.quantity || 1);
      setTimeout(() => setPrintingId(null), 1000);
    } catch (error) {
      setPrintError({ productId: product.id, message: error.message || 'Failed to print barcode' });
      setPrintingId(null);
      setTimeout(() => setPrintError(null), 5000);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return inventory;
    const query = searchQuery.toLowerCase().trim();
    return inventory.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.id.toLowerCase().includes(query) ||
      (product.size && product.size.toLowerCase().includes(query)) ||
      (product.nursery && product.nursery.toLowerCase().includes(query))
    );
  }, [inventory, searchQuery]);

  const styles = {
    container: { minHeight: '100vh', padding: '24px' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' },
    headerLeft: {},
    title: { fontSize: '26px', fontWeight: '700', color: c.primary[900], marginBottom: '4px' },
    subtitle: { fontSize: '14px', color: c.neutral[500] },
    searchBox: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', backgroundColor: c.neutral.white, borderRadius: '10px', border: `1px solid ${c.neutral[200]}`, width: '320px' },
    searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: c.neutral[900], backgroundColor: 'transparent' },
    clearBtn: { padding: '4px', borderRadius: '4px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: c.neutral[400], display: 'flex' },
    statsRow: { display: 'flex', gap: '16px', marginBottom: '20px' },
    statCard: { flex: 1, display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', backgroundColor: c.neutral.white, borderRadius: '12px', border: `1px solid ${c.neutral[200]}` },
    statIcon: { width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    statLabel: { fontSize: '12px', color: c.neutral[500], marginBottom: '2px' },
    statValue: { fontSize: '22px', fontWeight: '700', color: c.primary[900] },
    emptyState: { backgroundColor: c.neutral.white, borderRadius: '16px', padding: '60px 40px', textAlign: 'center', border: `1px solid ${c.neutral[200]}` },
    emptyIcon: { color: c.neutral[300], marginBottom: '16px' },
    emptyTitle: { fontSize: '18px', fontWeight: '600', color: c.neutral[700], marginBottom: '8px' },
    emptyText: { fontSize: '14px', color: c.neutral[500] },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
    card: { backgroundColor: c.neutral.white, borderRadius: '14px', border: `1px solid ${c.neutral[200]}`, overflow: 'hidden', transition: 'all 0.2s ease', cursor: 'default' },
    cardHover: { boxShadow: `0 8px 24px ${c.primary[900]}12`, borderColor: c.primary[300], transform: 'translateY(-2px)' },
    cardBody: { padding: '18px' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' },
    iconBox: { width: '44px', height: '44px', background: `linear-gradient(135deg, ${c.primary[500]} 0%, ${c.primary[700]} 100%)`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    productInfo: { flex: 1, minWidth: 0 },
    productName: { fontSize: '15px', fontWeight: '600', color: c.primary[900], marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    productId: { fontSize: '11px', fontFamily: 'monospace', color: c.neutral[500] },
    tagsRow: { display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' },
    tag: { fontSize: '11px', padding: '4px 8px', borderRadius: '5px', backgroundColor: c.neutral[100], color: c.neutral[600] },
    quantityRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' },
    qtyBox: { padding: '12px', borderRadius: '10px', textAlign: 'center' },
    qtyBoxInventory: { backgroundColor: c.primary[50], border: `1px solid ${c.primary[100]}` },
    qtyBoxOrdered: { backgroundColor: c.neutral[50], border: `1px solid ${c.neutral[200]}` },
    qtyLabel: { fontSize: '10px', fontWeight: '600', color: c.neutral[600], textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '4px' },
    qtyValue: { fontSize: '22px', fontWeight: '700' },
    qtyValueInventory: { color: c.primary[700] },
    qtyValueOrdered: { color: c.neutral[700] },
    lowStockBadge: { display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '600', color: c.error[600], marginTop: '4px' },
    priceRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: `1px solid ${c.neutral[100]}`, borderBottom: `1px solid ${c.neutral[100]}`, marginBottom: '14px' },
    priceLabel: { fontSize: '12px', color: c.neutral[500] },
    priceValue: { fontSize: '20px', fontWeight: '700', color: c.primary[800] },
    cardFooter: { padding: '12px 18px', backgroundColor: c.neutral[50], borderTop: `1px solid ${c.neutral[100]}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    totalValue: { fontSize: '11px', color: c.neutral[500] },
    totalAmount: { fontSize: '14px', fontWeight: '700', color: c.primary[900] },
    printBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: `1px solid ${c.primary[300]}`, backgroundColor: c.neutral.white, color: c.primary[700], fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s ease' },
    printBtnDisabled: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: `1px solid ${c.neutral[200]}`, backgroundColor: c.neutral[100], color: c.neutral[500], fontSize: '12px', fontWeight: '600', cursor: 'not-allowed' },
    errorBox: { margin: '0 18px 12px', padding: '10px', backgroundColor: c.error[50], borderRadius: '6px', border: `1px solid ${c.error[200]}`, fontSize: '12px', color: c.error[700], textAlign: 'center' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>Products</h1>
          <p style={styles.subtitle}>{filteredProducts.length} products in inventory</p>
        </div>
        <div style={styles.searchBox}>
          <Search size={18} color={c.neutral[400]} />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." style={styles.searchInput} />
          {searchQuery && <button onClick={() => setSearchQuery('')} style={styles.clearBtn}><X size={14} /></button>}
        </div>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: c.primary[100] }}><Package size={20} color={c.primary[600]} /></div>
          <div><div style={styles.statLabel}>Total Products</div><div style={styles.statValue}>{filteredProducts.length}</div></div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: c.success[100] }}><Boxes size={20} color={c.success[600]} /></div>
          <div><div style={styles.statLabel}>Total Inventory</div><div style={styles.statValue}>{filteredProducts.reduce((sum, p) => sum + (p.inventoryQuantity || p.quantity || 0), 0)}</div></div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: c.warning[100] }}><TrendingUp size={20} color={c.warning[600]} /></div>
          <div><div style={styles.statLabel}>Total Ordered</div><div style={styles.statValue}>{filteredProducts.reduce((sum, p) => sum + (p.orderedQuantity || 0), 0)}</div></div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: c.info[100] }}><DollarSign size={20} color={c.info[600]} /></div>
          <div><div style={styles.statLabel}>Total Value</div><div style={styles.statValue}>${filteredProducts.reduce((sum, p) => { const fp = (p.price || 0) * (1 + (p.rate || 0) / 100); return sum + ((p.inventoryQuantity || p.quantity || 0) * fp); }, 0).toFixed(0)}</div></div>
        </div>
      </div>

      {inventory.length === 0 ? (
        <div style={styles.emptyState}>
          <Package size={56} style={styles.emptyIcon} />
          <p style={styles.emptyTitle}>No products found</p>
          <p style={styles.emptyText}>Add your first product to get started</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={styles.emptyState}>
          <Search size={56} style={styles.emptyIcon} />
          <p style={styles.emptyTitle}>No matching products</p>
          <p style={styles.emptyText}>Try adjusting your search query</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredProducts.map((product) => {
            const finalPrice = (product.price || 0) * (1 + (product.rate || 0) / 100);
            const totalValue = (product.inventoryQuantity || product.quantity || 0) * finalPrice;
            const inventoryQty = product.inventoryQuantity || product.quantity || 0;
            const orderedQty = product.orderedQuantity || 0;
            const isLowStock = inventoryQty < 10 && inventoryQty > 0;
            const isOutOfStock = inventoryQty === 0;
            const isHovered = hoveredCard === product.id;
            
            return (
              <div key={product.id} style={{...styles.card, ...(isHovered ? styles.cardHover : {})}} onMouseEnter={() => setHoveredCard(product.id)} onMouseLeave={() => setHoveredCard(null)}>
                <div style={styles.cardBody}>
                  <div style={styles.cardHeader}>
                    <div style={styles.iconBox}><Package size={22} color="#fff" /></div>
                    <div style={styles.productInfo}>
                      <div style={styles.productName} title={product.name}>{product.name}</div>
                      <div style={styles.productId}>{product.id}</div>
                    </div>
                  </div>

                  {(product.size || product.nursery) && (
                    <div style={styles.tagsRow}>
                      {product.size && <span style={styles.tag}>{product.size}</span>}
                      {product.nursery && <span style={styles.tag}>{product.nursery}</span>}
                    </div>
                  )}

                  <div style={styles.quantityRow}>
                    <div style={{ ...styles.qtyBox, ...styles.qtyBoxInventory }}>
                      <div style={styles.qtyLabel}>In Stock</div>
                      <div style={{ ...styles.qtyValue, ...styles.qtyValueInventory, color: isOutOfStock ? c.error[600] : isLowStock ? c.warning[600] : c.primary[700] }}>{inventoryQty}</div>
                      {isLowStock && <div style={styles.lowStockBadge}><AlertCircle size={10} /> Low</div>}
                      {isOutOfStock && <div style={styles.lowStockBadge}><AlertCircle size={10} /> Out</div>}
                    </div>
                    <div style={{ ...styles.qtyBox, ...styles.qtyBoxOrdered }}>
                      <div style={styles.qtyLabel}>On Order</div>
                      <div style={{ ...styles.qtyValue, ...styles.qtyValueOrdered }}>{orderedQty}</div>
                    </div>
                  </div>

                  <div style={styles.priceRow}>
                    <span style={styles.priceLabel}>Price ({product.rate || 0}% markup)</span>
                    <span style={styles.priceValue}>${finalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {printError && printError.productId === product.id && <div style={styles.errorBox}>{printError.message}</div>}

                <div style={styles.cardFooter}>
                  <div>
                    <div style={styles.totalValue}>Total Value</div>
                    <div style={styles.totalAmount}>${totalValue.toFixed(2)}</div>
                  </div>
                  <button onClick={() => handleReprint(product)} disabled={printingId === product.id} style={printingId === product.id ? styles.printBtnDisabled : styles.printBtn}>
                    <Printer size={14} />{printingId === product.id ? 'Printing...' : 'Print'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
