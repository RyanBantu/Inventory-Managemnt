import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { User, Users, ShoppingCart, CheckCircle, Plus, Minus, Package, DollarSign, Percent, X, Box, Calculator, Search } from 'lucide-react';
import { calculateTotal } from '../../utils/helpers';
import { theme } from '../../theme';

const c = theme.colors;

const CreateOrder = () => {
  const navigate = useNavigate();
  const { inventory, createOrder } = useApp();
  const [designerName, setDesignerName] = useState('');
  const [clientName, setClientName] = useState('');
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInventory = useMemo(() => {
    if (!searchQuery.trim()) return inventory;
    const query = searchQuery.toLowerCase().trim();
    return inventory.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.id.toLowerCase().includes(query) ||
      (product.price && product.price.toString().includes(query)) ||
      (product.rate && product.rate.toString().includes(query))
    );
  }, [inventory, searchQuery]);

  const handleAddToCart = (product) => {
    const qty = parseInt(quantities[product.id] || 1);
    if (qty <= 0 || qty > product.quantity) {
      alert(`Invalid quantity. Available: ${product.quantity}`);
      return;
    }
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      setCart(cart.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + qty } : item));
    } else {
      const basePrice = product.price || 0;
      const ratePercent = product.rate || 0;
      const finalPrice = basePrice * (1 + ratePercent / 100);
      setCart([...cart, { productId: product.id, name: product.name, quantity: qty, price: finalPrice, basePrice, rate: ratePercent }]);
    }
    setQuantities({ ...quantities, [product.id]: '' });
  };

  const handleRemoveFromCart = (productId) => setCart(cart.filter(item => item.productId !== productId));
  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) { handleRemoveFromCart(productId); return; }
    setCart(cart.map(item => item.productId === productId ? { ...item, quantity: newQty } : item));
  };

  const handleCreateOrder = () => {
    if (!designerName || !clientName) { alert('Please enter designer and client names'); return; }
    if (cart.length === 0) { alert('Please add at least one product to cart'); return; }
    createOrder({ designerName, clientName, products: cart });
    alert('Order created successfully!');
    navigate('/orders');
  };

  const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '24px' },
    header: { marginBottom: '24px' },
    title: { fontSize: '36px', fontWeight: '800', color: c.primary[900], marginBottom: '8px' },
    subtitle: { fontSize: '16px', color: c.neutral[500] },
    grid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' },
    leftCol: { display: 'flex', flexDirection: 'column', gap: '24px' },
    card: { backgroundColor: c.neutral.white, borderRadius: '18px', padding: '24px', border: `1px solid ${c.neutral[200]}`, boxShadow: '0 1px 3px rgba(21,42,17,0.04)' },
    cardTitle: { fontSize: '20px', fontWeight: '700', color: c.primary[900], marginBottom: '24px' },
    inputGroup: { marginBottom: '20px' },
    label: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: c.neutral[700], marginBottom: '10px' },
    input: { width: '100%', padding: '14px 16px', border: `1px solid ${c.neutral[200]}`, borderRadius: '10px', fontSize: '15px', color: c.neutral[900], backgroundColor: c.neutral[50], outline: 'none', boxSizing: 'border-box' },
    productHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' },
    badge: { fontSize: '14px', color: c.neutral[500], backgroundColor: c.neutral[100], padding: '6px 12px', borderRadius: '20px', fontWeight: '500' },
    searchBox: { position: 'relative', marginBottom: '24px' },
    searchInput: { width: '100%', padding: '14px 16px 14px 48px', border: `2px solid ${c.neutral[200]}`, borderRadius: '12px', fontSize: '15px', color: c.neutral[900], backgroundColor: c.neutral.white, outline: 'none', boxSizing: 'border-box' },
    searchIcon: { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: c.neutral[400] },
    clearBtn: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', padding: '6px', background: 'none', border: 'none', color: c.neutral[400], cursor: 'pointer', borderRadius: '6px' },
    productList: { display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '600px', overflowY: 'auto', paddingRight: '8px' },
    productCard: { padding: '20px', border: `2px solid ${c.neutral[200]}`, borderRadius: '14px', backgroundColor: c.neutral.white, transition: 'all 0.2s' },
    productIcon: { width: '48px', height: '48px', background: `linear-gradient(135deg, ${c.primary[600]} 0%, ${c.primary[700]} 100%)`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${c.primary[600]}30` },
    productName: { fontSize: '18px', fontWeight: '700', color: c.primary[900], marginBottom: '4px' },
    productId: { fontSize: '12px', color: c.neutral[400], fontFamily: 'monospace', backgroundColor: c.neutral[100], padding: '2px 8px', borderRadius: '4px' },
    statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' },
    statItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' },
    addSection: { display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: `1px solid ${c.neutral[200]}`, marginTop: '16px' },
    qtyInput: { width: '80px', padding: '10px 12px', border: `2px solid ${c.neutral[200]}`, borderRadius: '8px', fontSize: '15px', textAlign: 'center', fontWeight: '600', outline: 'none' },
    addBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: `linear-gradient(135deg, ${c.primary[600]} 0%, ${c.primary[700]} 100%)`, color: c.neutral.white, border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: `0 4px 12px ${c.primary[600]}30` },
    emptyState: { textAlign: 'center', padding: '48px 24px' },
    emptyIcon: { width: '64px', height: '64px', backgroundColor: c.neutral[100], borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
    emptyTitle: { fontSize: '18px', fontWeight: '600', color: c.neutral[500], marginBottom: '4px' },
    emptyText: { fontSize: '14px', color: c.neutral[400] },
    cartCard: { backgroundColor: c.neutral.white, borderRadius: '18px', border: `2px solid ${c.neutral[200]}`, boxShadow: `0 4px 20px ${c.primary[900]}10`, position: 'sticky', top: '32px', overflow: 'hidden' },
    cartHeader: { background: `linear-gradient(135deg, ${c.primary[600]} 0%, ${c.primary[800]} 100%)`, padding: '24px', color: c.neutral.white },
    cartTitle: { fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' },
    cartBadge: { backgroundColor: 'rgba(255,255,255,0.2)', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' },
    cartSubtitle: { fontSize: '14px', color: c.primary[100] },
    cartContent: { padding: '24px' },
    cartItems: { display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '450px', overflowY: 'auto', marginBottom: '24px', paddingRight: '8px' },
    cartItem: { padding: '16px', border: `2px solid ${c.neutral[200]}`, borderRadius: '12px', backgroundColor: c.neutral[50] },
    cartItemName: { fontSize: '14px', fontWeight: '700', color: c.primary[900], marginBottom: '4px' },
    cartItemPrice: { fontSize: '12px', color: c.neutral[500] },
    removeBtn: { background: 'none', border: 'none', color: c.error[500], cursor: 'pointer', padding: '6px', borderRadius: '6px' },
    qtyControls: { display: 'flex', alignItems: 'center', gap: '8px' },
    qtyBtn: { padding: '8px', backgroundColor: c.neutral[100], border: 'none', borderRadius: '8px', color: c.primary[700], cursor: 'pointer', fontWeight: '700' },
    qtyDisplay: { fontSize: '14px', fontWeight: '700', color: c.primary[900], width: '40px', textAlign: 'center', backgroundColor: c.neutral.white, padding: '4px 8px', borderRadius: '6px' },
    subtotalBox: { background: `linear-gradient(135deg, ${c.primary[50]} 0%, ${c.primary[100]} 100%)`, borderRadius: '12px', padding: '16px', border: `1px solid ${c.primary[200]}`, marginBottom: '16px' },
    subtotalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
    subtotalLabel: { fontSize: '14px', fontWeight: '500', color: c.neutral[700] },
    subtotalValue: { fontSize: '15px', fontWeight: '600', color: c.primary[900] },
    totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: `1px solid ${c.primary[200]}` },
    totalLabel: { fontSize: '18px', fontWeight: '700', color: c.primary[900] },
    totalValue: { fontSize: '28px', fontWeight: '800', color: c.primary[600] },
    createBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '18px 24px', background: `linear-gradient(135deg, ${c.primary[600]} 0%, ${c.primary[700]} 100%)`, color: c.neutral.white, border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: '600', cursor: 'pointer', boxShadow: `0 4px 20px ${c.primary[600]}40` },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Create New Order</h1>
        <p style={styles.subtitle}>Select products and add them to your cart</p>
      </div>
      
      <div style={styles.grid}>
        <div style={styles.leftCol}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Order Information</h2>
            <div style={styles.inputGroup}>
              <label style={styles.label}><User size={16} color={c.primary[600]} /> Designer Name</label>
              <input type="text" value={designerName} onChange={(e) => setDesignerName(e.target.value)} style={styles.input} placeholder="Enter designer name" />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}><Users size={16} color={c.primary[600]} /> Client Name</label>
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} style={styles.input} placeholder="Enter client name" />
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.productHeader}>
              <h2 style={{...styles.cardTitle, marginBottom: 0}}>Available Products</h2>
              <span style={styles.badge}>{filteredInventory.length} {filteredInventory.length === 1 ? 'product' : 'products'}{searchQuery && ` (of ${inventory.length})`}</span>
            </div>

            <div style={styles.searchBox}>
              <Search size={20} style={styles.searchIcon} />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products by name, ID, price, or rate..." style={styles.searchInput} />
              {searchQuery && <button onClick={() => setSearchQuery('')} style={styles.clearBtn}><X size={16} /></button>}
            </div>

            <div style={styles.productList}>
              {inventory.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}><Package size={28} color={c.neutral[300]} /></div>
                  <p style={styles.emptyTitle}>No products available</p>
                  <p style={styles.emptyText}>Add products first to create orders</p>
                </div>
              ) : filteredInventory.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}><Search size={28} color={c.neutral[300]} /></div>
                  <p style={styles.emptyTitle}>No products found</p>
                  <p style={styles.emptyText}>Try adjusting your search query</p>
                </div>
              ) : (
                filteredInventory.map((product) => {
                  const finalPrice = (product.price || 0) * (1 + (product.rate || 0) / 100);
                  return (
                    <div key={product.id} style={styles.productCard}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={styles.productIcon}><Package size={24} color={c.neutral.white} /></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <h3 style={styles.productName}>{product.name}</h3>
                            <span style={styles.productId}>{product.id}</span>
                          </div>
                          <div style={styles.statsGrid}>
                            <div style={styles.statItem}><Box size={16} color={c.primary[500]} /><span style={{ color: c.neutral[600] }}>Stock:</span><span style={{ fontWeight: '700', color: c.primary[900] }}>{product.quantity || 0}</span></div>
                            <div style={styles.statItem}><DollarSign size={16} color={c.success[500]} /><span style={{ color: c.neutral[600] }}>Base:</span><span style={{ fontWeight: '600', color: c.primary[900] }}>${(product.price || 0).toFixed(2)}</span></div>
                            <div style={styles.statItem}><Percent size={16} color={c.warning[500]} /><span style={{ color: c.neutral[600] }}>Markup:</span><span style={{ fontWeight: '600', color: c.primary[900] }}>{product.rate || 0}%</span></div>
                            <div style={styles.statItem}><Calculator size={16} color={c.primary[600]} /><span style={{ color: c.neutral[600] }}>Price:</span><span style={{ fontWeight: '700', color: c.primary[600] }}>${finalPrice.toFixed(2)}</span></div>
                          </div>
                        </div>
                      </div>
                      <div style={styles.addSection}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: c.neutral[700] }}>Quantity:</span>
                          <input type="number" min="1" max={product.quantity} value={quantities[product.id] || ''} onChange={(e) => setQuantities({ ...quantities, [product.id]: e.target.value })} style={styles.qtyInput} placeholder="1" />
                          <span style={{ fontSize: '12px', color: c.neutral[500] }}>max: {product.quantity}</span>
                        </div>
                        <button onClick={() => handleAddToCart(product)} style={styles.addBtn}><ShoppingCart size={16} /> Add to Cart</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div>
          <div style={styles.cartCard}>
            <div style={styles.cartHeader}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <h2 style={styles.cartTitle}>Current List</h2>
                {cart.length > 0 && <span style={styles.cartBadge}>{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>}
              </div>
              {cart.length > 0 && <p style={styles.cartSubtitle}>Review your order before checkout</p>}
            </div>

            <div style={styles.cartContent}>
              {cart.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}><ShoppingCart size={40} color={c.neutral[300]} /></div>
                  <p style={styles.emptyTitle}>Your cart is empty</p>
                  <p style={styles.emptyText}>Add products from the left to get started</p>
                </div>
              ) : (
                <>
                  <div style={styles.cartItems}>
                    {cart.map((item) => (
                      <div key={item.productId} style={styles.cartItem}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <div>
                            <h4 style={styles.cartItemName}>{item.name}</h4>
                            <p style={styles.cartItemPrice}>${item.price.toFixed(2)} per unit</p>
                          </div>
                          <button onClick={() => handleRemoveFromCart(item.productId)} style={styles.removeBtn}><X size={16} /></button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: `1px solid ${c.neutral[200]}` }}>
                          <div style={styles.qtyControls}>
                            <button onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)} style={styles.qtyBtn}><Minus size={16} /></button>
                            <span style={styles.qtyDisplay}>{item.quantity}</span>
                            <button onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)} style={styles.qtyBtn}><Plus size={16} /></button>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '12px', color: c.neutral[500], marginBottom: '4px' }}>Subtotal</p>
                            <p style={{ fontSize: '18px', fontWeight: '700', color: c.primary[900] }}>${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={styles.subtotalBox}>
                    <div style={styles.subtotalRow}>
                      <span style={styles.subtotalLabel}>Subtotal</span>
                      <span style={styles.subtotalValue}>${calculateTotal(cart).toFixed(2)}</span>
                    </div>
                    <div style={styles.totalRow}>
                      <span style={styles.totalLabel}>Total</span>
                      <span style={styles.totalValue}>${calculateTotal(cart).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button onClick={handleCreateOrder} style={styles.createBtn}><CheckCircle size={20} /> Create Order</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
