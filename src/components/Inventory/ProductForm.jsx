import { Hash, Tag, Box, DollarSign, Calculator } from 'lucide-react';
import { theme } from '../../theme';

const c = theme.colors;

const ProductForm = ({ product, onChange, onSubmit }) => {
  const handleChange = (field, value) => {
    onChange({ ...product, [field]: value });
  };

  const styles = {
    form: { display: 'flex', flexDirection: 'column', gap: '24px' },
    card: { backgroundColor: c.neutral.white, borderRadius: '18px', padding: '32px', border: `1px solid ${c.neutral[200]}`, boxShadow: '0 1px 3px rgba(21,42,17,0.04)' },
    header: { marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: '700', color: c.primary[900], marginBottom: '8px' },
    subtitle: { fontSize: '15px', color: c.neutral[500] },
    fieldsContainer: { display: 'flex', flexDirection: 'column', gap: '24px' },
    inputGroup: {},
    label: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: c.neutral[700], marginBottom: '10px' },
    input: { width: '100%', padding: '14px 16px', border: `1px solid ${c.neutral[200]}`, borderRadius: '10px', fontSize: '15px', color: c.neutral[900], backgroundColor: c.neutral[50] },
    inputReadOnly: { width: '100%', padding: '14px 16px', border: `1px solid ${c.neutral[200]}`, borderRadius: '10px', fontSize: '15px', color: c.neutral[500], backgroundColor: c.neutral[100], cursor: 'not-allowed', fontFamily: 'monospace' },
    gridTwo: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
    relativeInput: { position: 'relative' },
    percentSymbol: { position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: c.neutral[500], fontWeight: '600' },
    hint: { fontSize: '12px', color: c.neutral[500], marginTop: '8px' },
    submitBtn: { marginTop: '16px', width: '100%', padding: '16px 24px', border: 'none', borderRadius: '12px', background: `linear-gradient(135deg, ${c.primary[600]} 0%, ${c.primary[700]} 100%)`, color: c.neutral.white, fontSize: '16px', fontWeight: '600', cursor: 'pointer', boxShadow: `0 4px 12px ${c.primary[600]}40` },
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} style={styles.form}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Add New Product</h2>
          <p style={styles.subtitle}>Fill in the product details below</p>
        </div>
        
        <div style={styles.fieldsContainer}>
          <div style={styles.inputGroup}>
            <label style={styles.label}><Hash size={16} color={c.primary[600]} /> Product ID</label>
            <input type="text" value={product.id || ''} readOnly style={styles.inputReadOnly} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}><Tag size={16} color={c.primary[600]} /> Item Name</label>
            <input type="text" value={product.name || ''} onChange={(e) => handleChange('name', e.target.value)} required placeholder="Enter product name" style={styles.input} />
          </div>

          <div style={styles.gridTwo}>
            <div style={styles.inputGroup}>
              <label style={styles.label}><Box size={16} color={c.primary[600]} /> Size</label>
              <input type="text" value={product.size || ''} onChange={(e) => handleChange('size', e.target.value)} required placeholder="e.g., Small, Medium, Large" style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}><Tag size={16} color={c.primary[600]} /> Nursery</label>
              <input type="text" value={product.nursery || ''} onChange={(e) => handleChange('nursery', e.target.value)} required placeholder="Enter nursery name" style={styles.input} />
            </div>
          </div>

          <div style={styles.gridTwo}>
            <div style={styles.inputGroup}>
              <label style={styles.label}><Box size={16} color={c.primary[600]} /> Quantity</label>
              <input
                type="number"
                value={product.quantity === 0 ? '' : (product.quantity ?? '')}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') { handleChange('quantity', ''); }
                  else { const qty = parseFloat(value); if (!isNaN(qty) && qty >= 0) handleChange('quantity', qty); }
                }}
                onBlur={(e) => { const value = e.target.value; if (value === '' || isNaN(parseFloat(value))) handleChange('quantity', 0); }}
                required min="0" step="1" placeholder="0" style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}><DollarSign size={16} color={c.primary[600]} /> Base Price (per unit)</label>
              <input
                type="number"
                value={product.price === 0 ? '' : (product.price || '')}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') { handleChange('price', ''); }
                  else { const price = parseFloat(value); if (!isNaN(price) && price >= 0) handleChange('price', price); }
                }}
                onBlur={(e) => { const value = e.target.value; if (value === '' || isNaN(parseFloat(value))) handleChange('price', 0); }}
                required min="0" step="0.01" placeholder="0.00" style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}><Calculator size={16} color={c.primary[600]} /> Rate (Percentage Markup)</label>
            <div style={styles.relativeInput}>
              <input
                type="number"
                value={product.rate === 0 ? '' : (product.rate || '')}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') { handleChange('rate', ''); }
                  else { const rate = parseFloat(value); if (!isNaN(rate) && rate >= 0) handleChange('rate', rate); }
                }}
                onBlur={(e) => { const value = e.target.value; if (value === '' || isNaN(parseFloat(value))) handleChange('rate', 0); }}
                required min="0" step="0.01" placeholder="0.00" style={{...styles.input, paddingRight: '40px'}}
              />
              <span style={styles.percentSymbol}>%</span>
            </div>
            <p style={styles.hint}>This percentage will be added to the base price in bills</p>
          </div>
        </div>

        <button type="submit" style={styles.submitBtn}>Add Product to Inventory</button>
      </div>
    </form>
  );
};

export default ProductForm;
            