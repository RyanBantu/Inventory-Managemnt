import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Edit, Save, Receipt, Trash2, Plus, Minus, DollarSign } from 'lucide-react';
import { calculateTotal } from '../../utils/helpers';
import { theme } from '../../theme';

const c = theme.colors;

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, updateOrder } = useApp();
  const order = getOrderById(id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [designerName, setDesignerName] = useState('');
  const [clientName, setClientName] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (order) {
      setDesignerName(order.designerName);
      setClientName(order.clientName);
      setProducts([...order.products]);
    }
  }, [order]);

  const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1024px', margin: '0 auto' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' },
    title: { fontSize: '36px', fontWeight: '800', color: c.primary[900], marginBottom: '8px' },
    subtitle: { fontSize: '16px', color: c.neutral[500] },
    btnGroup: { display: 'flex', gap: '12px' },
    btnPrimary: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: `linear-gradient(135deg, ${c.primary[600]} 0%, ${c.primary[700]} 100%)`, color: c.neutral.white, border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: `0 4px 12px ${c.primary[600]}30` },
    btnSecondary: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: c.primary[500], color: c.neutral.white, border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: `0 4px 12px ${c.primary[500]}30` },
    btnSuccess: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: c.success[500], color: c.neutral.white, border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: `0 4px 12px ${c.success[500]}30` },
    card: { backgroundColor: c.neutral.white, borderRadius: '18px', padding: '32px', border: `1px solid ${c.neutral[200]}`, boxShadow: '0 1px 3px rgba(21,42,17,0.04)' },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' },
    label: { fontSize: '13px', fontWeight: '600', color: c.neutral[700], marginBottom: '12px', display: 'block' },
    input: { width: '100%', padding: '12px 16px', border: `1px solid ${c.neutral[200]}`, borderRadius: '10px', fontSize: '15px', color: c.neutral[900], boxSizing: 'border-box' },
    value: { fontSize: '18px', fontWeight: '600', color: c.primary[900] },
    divider: { borderTop: `1px solid ${c.neutral[200]}`, paddingTop: '32px' },
    sectionTitle: { fontSize: '20px', fontWeight: '700', color: c.primary[900], marginBottom: '16px' },
    table: { width: '100%', borderCollapse: 'collapse', border: `1px solid ${c.neutral[200]}`, borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' },
    th: { padding: '14px 16px', backgroundColor: c.primary[50], fontSize: '14px', fontWeight: '700', color: c.primary[800], textAlign: 'left' },
    thCenter: { padding: '14px 16px', backgroundColor: c.primary[50], fontSize: '14px', fontWeight: '700', color: c.primary[800], textAlign: 'center' },
    thRight: { padding: '14px 16px', backgroundColor: c.primary[50], fontSize: '14px', fontWeight: '700', color: c.primary[800], textAlign: 'right' },
    td: { padding: '14px 16px', borderTop: `1px solid ${c.neutral[100]}` },
    tdCenter: { padding: '14px 16px', borderTop: `1px solid ${c.neutral[100]}`, textAlign: 'center' },
    tdRight: { padding: '14px 16px', borderTop: `1px solid ${c.neutral[100]}`, textAlign: 'right' },
    productName: { fontWeight: '600', color: c.primary[900] },
    qtyControls: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    qtyBtn: { padding: '6px', backgroundColor: c.neutral[100], border: 'none', borderRadius: '6px', color: c.primary[700], cursor: 'pointer' },
    qtyInput: { width: '64px', padding: '6px 8px', border: `1px solid ${c.neutral[200]}`, borderRadius: '6px', textAlign: 'center', fontSize: '14px', fontWeight: '600' },
    removeBtn: { padding: '6px', backgroundColor: 'transparent', border: 'none', color: c.error[500], cursor: 'pointer', borderRadius: '6px' },
    totalBox: { background: `linear-gradient(135deg, ${c.primary[50]} 0%, ${c.primary[100]} 100%)`, borderRadius: '12px', padding: '20px', border: `1px solid ${c.primary[200]}` },
    totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontSize: '18px', fontWeight: '600', color: c.neutral[700] },
    totalValue: { fontSize: '32px', fontWeight: '800', color: c.primary[600] },
    emptyState: { textAlign: 'center', padding: '48px', color: c.neutral[500] },
  };

  if (!order) {
    return <div style={styles.emptyState}><p>Order not found</p></div>;
  }

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) { setProducts(products.filter(p => p.productId !== productId)); return; }
    setProducts(products.map(p => p.productId === productId ? { ...p, quantity: newQty } : p));
  };

  const handleRemoveProduct = (productId) => setProducts(products.filter(p => p.productId !== productId));

  const handleUpdateOrder = () => {
    updateOrder(id, { designerName, clientName, products });
    setIsEditing(false);
    alert('Order updated successfully!');
  };

  const handleGenerateBill = () => navigate(`/bill/${id}`);

  const handleMarkAsPaid = () => {
    if (window.confirm('Mark this order as paid? It will move to the employee dashboard.')) {
      updateOrder(id, { status: 'paid' });
      alert('Order marked as paid!');
      navigate('/orders');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Order Details</h1>
          <p style={styles.subtitle}>View and edit order information</p>
        </div>
        <div style={styles.btnGroup}>
          {isEditing ? (
            <button onClick={handleUpdateOrder} style={styles.btnSuccess}><Save size={16} /> Save Changes</button>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} style={styles.btnSecondary}><Edit size={16} /> Edit Order</button>
              {order.status !== 'paid' && (
                <button onClick={handleMarkAsPaid} style={styles.btnSuccess}><DollarSign size={16} /> Mark as Paid</button>
              )}
            </>
          )}
          <button onClick={handleGenerateBill} style={styles.btnPrimary}><Receipt size={16} /> Generate Bill</button>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.grid2}>
          <div>
            <label style={styles.label}>Designer Name</label>
            {isEditing ? (
              <input type="text" value={designerName} onChange={(e) => setDesignerName(e.target.value)} style={styles.input} />
            ) : (
              <p style={styles.value}>{designerName}</p>
            )}
          </div>
          <div>
            <label style={styles.label}>Client Name</label>
            {isEditing ? (
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} style={styles.input} />
            ) : (
              <p style={styles.value}>{clientName}</p>
            )}
          </div>
        </div>

        <div style={styles.divider}>
          <h3 style={styles.sectionTitle}>Products ({products.length})</h3>
          
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Product</th>
                <th style={styles.thCenter}>Quantity</th>
                <th style={styles.thRight}>Unit Price</th>
                <th style={styles.thRight}>Total</th>
                {isEditing && <th style={{ ...styles.thCenter, width: '80px' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.productId} style={{ backgroundColor: index % 2 === 0 ? c.neutral.white : c.neutral[50] }}>
                  <td style={styles.td}><span style={styles.productName}>{product.name}</span></td>
                  <td style={styles.tdCenter}>
                    {isEditing ? (
                      <div style={styles.qtyControls}>
                        <button onClick={() => handleUpdateQuantity(product.productId, product.quantity - 1)} style={styles.qtyBtn}><Minus size={14} /></button>
                        <input type="number" min="1" value={product.quantity} onChange={(e) => handleUpdateQuantity(product.productId, parseInt(e.target.value) || 1)} style={styles.qtyInput} />
                        <button onClick={() => handleUpdateQuantity(product.productId, product.quantity + 1)} style={styles.qtyBtn}><Plus size={14} /></button>
                      </div>
                    ) : (
                      <span style={{ fontWeight: '600', color: c.neutral[700] }}>{product.quantity}</span>
                    )}
                  </td>
                  <td style={{ ...styles.tdRight, color: c.neutral[600] }}>${product.price.toFixed(2)}</td>
                  <td style={styles.tdRight}><span style={{ fontWeight: '700', color: c.primary[900] }}>${(product.price * product.quantity).toFixed(2)}</span></td>
                  {isEditing && (
                    <td style={styles.tdCenter}><button onClick={() => handleRemoveProduct(product.productId)} style={styles.removeBtn}><Trash2 size={16} /></button></td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.totalBox}>
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total Amount:</span>
              <span style={styles.totalValue}>${calculateTotal(products).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
