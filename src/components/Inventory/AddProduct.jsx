import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ProductForm from './ProductForm';
import { Check, AlertCircle, Printer } from 'lucide-react';
import { generateProductId } from '../../utils/helpers';
import { theme } from '../../theme';

const c = theme.colors;

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct, inventory, lastPrintStatus, clearPrintStatus } = useApp();
  const [product, setProduct] = useState({
    name: '',
    size: '',
    nursery: '',
    quantity: 0,
    rate: 0,
    price: 0,
    inventoryQuantity: 0,
    orderedQuantity: 0,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    return () => { if (lastPrintStatus) clearPrintStatus(); };
  }, [lastPrintStatus, clearPrintStatus]);

  const handleSubmit = () => {
    addProduct(product);
    setShowSuccess(true);
    setTimeout(() => navigate('/'), 2000);
  };

  const styles = {
    container: { maxWidth: '768px', margin: '0 auto' },
    successAlert: { marginBottom: '24px', padding: '16px', backgroundColor: c.primary[50], border: `2px solid ${c.primary[200]}`, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', color: c.primary[700] },
    successIcon: { padding: '8px', backgroundColor: c.primary[100], borderRadius: '8px', display: 'flex' },
    printAlert: (success) => ({ marginBottom: '24px', padding: '16px', backgroundColor: success ? c.primary[50] : c.warning[50], border: `2px solid ${success ? c.primary[200] : c.warning[200]}`, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', color: success ? c.primary[700] : c.warning[700] }),
    printIcon: (success) => ({ padding: '8px', backgroundColor: success ? c.primary[100] : c.warning[100], borderRadius: '8px', display: 'flex' }),
    dismissBtn: { fontSize: '14px', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' },
  };

  return (
    <div style={styles.container}>
      {showSuccess && (
        <div style={styles.successAlert}>
          <div style={styles.successIcon}><Check size={20} /></div>
          <span style={{ fontWeight: '600' }}>Product added successfully! Redirecting...</span>
        </div>
      )}
      
      {showSuccess && lastPrintStatus && (
        <div style={styles.printAlert(lastPrintStatus.success)}>
          <div style={styles.printIcon(lastPrintStatus.success)}>
            {lastPrintStatus.success ? <Printer size={20} /> : <AlertCircle size={20} />}
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: '600' }}>{lastPrintStatus.message}</span>
            {!lastPrintStatus.success && (
              <p style={{ fontSize: '14px', marginTop: '4px', opacity: 0.9 }}>You can reprint the barcode later from the Products page.</p>
            )}
          </div>
          <button onClick={clearPrintStatus} style={styles.dismissBtn}>Dismiss</button>
        </div>
      )}
      
      <ProductForm product={{ ...product, id: generateProductId(inventory) }} onChange={setProduct} onSubmit={handleSubmit} />
    </div>
  );
};

export default AddProduct;
