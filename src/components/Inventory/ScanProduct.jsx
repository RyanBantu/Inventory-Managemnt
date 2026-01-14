import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Package, Check, X, Scan, AlertCircle, Lightbulb, Clock, Hash, Box } from 'lucide-react';
import { theme } from '../../theme';

const c = theme.colors;

const ScanProduct = () => {
  const { findProductByBarcode, deductProductQuantity } = useApp();
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { 
    if (scanResult) { 
      const timer = setTimeout(() => inputRef.current?.focus(), 2000); 
      return () => clearTimeout(timer); 
    } 
  }, [scanResult]);

  const styles = {
    container: { maxWidth: '960px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '26px', fontWeight: '700', color: c.primary[900], marginBottom: '4px' },
    subtitle: { fontSize: '14px', color: c.neutral[500] },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    card: { backgroundColor: c.neutral.white, borderRadius: '14px', border: `1px solid ${c.neutral[200]}`, overflow: 'hidden' },
    cardHeader: { padding: '16px 20px', borderBottom: `1px solid ${c.neutral[100]}`, display: 'flex', alignItems: 'center', gap: '10px' },
    cardTitle: { fontSize: '15px', fontWeight: '600', color: c.primary[900] },
    cardBody: { padding: '20px' },
    inputGroup: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '12px', fontWeight: '600', color: c.neutral[600], marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.3px' },
    inputRow: { display: 'flex', gap: '10px' },
    input: { flex: 1, padding: '12px 14px', border: `1px solid ${c.neutral[300]}`, borderRadius: '10px', fontSize: '16px', fontFamily: 'monospace', color: c.neutral[900], outline: 'none', transition: 'border-color 0.15s' },
    submitBtn: { padding: '12px 20px', background: `linear-gradient(135deg, ${c.primary[600]} 0%, ${c.primary[700]} 100%)`, color: c.neutral.white, border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    hint: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: c.neutral[500], marginTop: '12px', padding: '10px 12px', backgroundColor: c.neutral[50], borderRadius: '8px' },
    resultBox: (success) => ({ backgroundColor: c.neutral.white, borderRadius: '14px', border: `2px solid ${success ? c.success[300] : c.error[300]}`, overflow: 'hidden', marginBottom: '20px' }),
    resultHeader: (success) => ({ padding: '14px 20px', backgroundColor: success ? c.success[50] : c.error[50], display: 'flex', alignItems: 'center', gap: '12px' }),
    resultIcon: (success) => ({ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: success ? c.success[500] : c.error[500], display: 'flex', alignItems: 'center', justifyContent: 'center' }),
    resultTitle: (success) => ({ fontSize: '16px', fontWeight: '700', color: success ? c.success[800] : c.error[800] }),
    resultBody: { padding: '16px 20px' },
    resultRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${c.neutral[100]}` },
    resultLabel: { fontSize: '13px', color: c.neutral[600] },
    resultValue: { fontSize: '14px', fontWeight: '600', color: c.neutral[900] },
    quantityValue: (low) => ({ fontSize: '18px', fontWeight: '700', color: low ? c.warning[600] : c.success[600] }),
    barcodeDisplay: { fontFamily: 'monospace', fontSize: '13px', backgroundColor: c.neutral[100], padding: '6px 10px', borderRadius: '6px', color: c.neutral[700] },
    outOfStock: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: c.error[600], marginTop: '8px' },
    recentList: { display: 'flex', flexDirection: 'column', gap: '8px' },
    recentItem: (highlight) => ({ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', backgroundColor: highlight ? c.primary[50] : c.neutral[50], borderRadius: '10px', border: `1px solid ${highlight ? c.primary[200] : c.neutral[100]}` }),
    recentIcon: { width: '36px', height: '36px', borderRadius: '8px', backgroundColor: c.primary[100], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    recentInfo: { flex: 1, minWidth: 0 },
    recentName: { fontSize: '14px', fontWeight: '600', color: c.primary[900], whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    recentMeta: { display: 'flex', gap: '12px', marginTop: '4px' },
    recentMetaItem: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: c.neutral[500] },
    recentQty: (low) => ({ fontSize: '16px', fontWeight: '700', color: low ? c.warning[600] : c.success[600], textAlign: 'right' }),
    recentQtyLabel: { fontSize: '10px', color: c.neutral[500], textAlign: 'right' },
    emptyState: { textAlign: 'center', padding: '40px 20px', color: c.neutral[400] },
    emptyIcon: { marginBottom: '12px' },
    emptyText: { fontSize: '14px' },
  };

  const handleScan = (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    const product = findProductByBarcode(barcodeInput.trim());

    if (product) {
      const currentQty = product.inventoryQuantity || product.quantity || 0;
      if (currentQty <= 0) {
        setScanResult({ success: false, message: 'Out of stock!', product, timestamp: new Date() });
      } else {
        deductProductQuantity(product.id, 1);
        setScanResult({ success: true, message: 'Quantity deducted successfully!', product, newQuantity: currentQty - 1, timestamp: new Date() });
        setRecentScans(prev => [{ ...product, scannedAt: new Date(), newQuantity: currentQty - 1 }, ...prev.slice(0, 9)]);
      }
    } else {
      setScanResult({ success: false, message: 'Product not found!', barcode: barcodeInput, timestamp: new Date() });
    }
    setBarcodeInput('');
    setTimeout(() => setScanResult(null), 4000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Scan Products</h1>
        <p style={styles.subtitle}>Deduct inventory by scanning product barcodes</p>
      </div>

      {scanResult && (
        <div style={styles.resultBox(scanResult.success)}>
          <div style={styles.resultHeader(scanResult.success)}>
            <div style={styles.resultIcon(scanResult.success)}>
              {scanResult.success ? <Check size={22} color="#fff" /> : <X size={22} color="#fff" />}
            </div>
            <div>
              <div style={styles.resultTitle(scanResult.success)}>{scanResult.message}</div>
            </div>
          </div>
          <div style={styles.resultBody}>
            {scanResult.product ? (
              <>
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>Product Name</span>
                  <span style={styles.resultValue}>{scanResult.product.name}</span>
                </div>
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>Product ID</span>
                  <span style={styles.barcodeDisplay}>{scanResult.product.id}</span>
                </div>
                {scanResult.product.size && (
                  <div style={styles.resultRow}>
                    <span style={styles.resultLabel}>Size</span>
                    <span style={styles.resultValue}>{scanResult.product.size}</span>
                  </div>
                )}
                {scanResult.product.nursery && (
                  <div style={styles.resultRow}>
                    <span style={styles.resultLabel}>Nursery</span>
                    <span style={styles.resultValue}>{scanResult.product.nursery}</span>
                  </div>
                )}
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>Base Price</span>
                  <span style={styles.resultValue}>${(scanResult.product.price || 0).toFixed(2)}</span>
                </div>
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>Markup Rate</span>
                  <span style={styles.resultValue}>{scanResult.product.rate || 0}%</span>
                </div>
                <div style={styles.resultRow}>
                  <span style={styles.resultLabel}>Final Price</span>
                  <span style={styles.resultValue}>${((scanResult.product.price || 0) * (1 + (scanResult.product.rate || 0) / 100)).toFixed(2)}</span>
                </div>
                {scanResult.success && (
                  <div style={{ ...styles.resultRow, borderBottom: 'none' }}>
                    <span style={styles.resultLabel}>Remaining Quantity</span>
                    <span style={styles.quantityValue(scanResult.newQuantity < 10)}>{scanResult.newQuantity}</span>
                  </div>
                )}
                {!scanResult.success && (scanResult.product.inventoryQuantity || scanResult.product.quantity || 0) === 0 && (
                  <div style={styles.outOfStock}><AlertCircle size={16} /> This product is out of stock</div>
                )}
              </>
            ) : (
              <div style={styles.resultRow}>
                <span style={styles.resultLabel}>Scanned Barcode</span>
                <span style={styles.barcodeDisplay}>{scanResult.barcode}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Scan size={18} color={c.primary[600]} />
            <span style={styles.cardTitle}>Scanner Input</span>
          </div>
          <div style={styles.cardBody}>
            <form onSubmit={handleScan}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Barcode</label>
                <div style={styles.inputRow}>
                  <input 
                    ref={inputRef} 
                    type="text" 
                    value={barcodeInput} 
                    onChange={(e) => setBarcodeInput(e.target.value)} 
                    placeholder="Scan or enter barcode..." 
                    style={styles.input} 
                    autoFocus 
                  />
                  <button type="submit" style={styles.submitBtn}>
                    <Scan size={18} /> Scan
                  </button>
                </div>
              </div>
              <div style={styles.hint}>
                <Lightbulb size={16} color={c.warning[500]} />
                <span>Keep this field focused for continuous scanning</span>
              </div>
            </form>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Clock size={18} color={c.neutral[500]} />
            <span style={styles.cardTitle}>Recent Scans</span>
          </div>
          <div style={styles.cardBody}>
            {recentScans.length > 0 ? (
              <div style={styles.recentList}>
                {recentScans.slice(0, 5).map((scan, index) => (
                  <div key={index} style={styles.recentItem(index === 0)}>
                    <div style={styles.recentIcon}>
                      <Package size={18} color={c.primary[600]} />
                    </div>
                    <div style={styles.recentInfo}>
                      <div style={styles.recentName}>{scan.name}</div>
                      <div style={styles.recentMeta}>
                        <span style={styles.recentMetaItem}><Hash size={12} /> {scan.id}</span>
                        <span style={styles.recentMetaItem}><Clock size={12} /> {new Date(scan.scannedAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <div>
                      <div style={styles.recentQty(scan.newQuantity < 10)}>{scan.newQuantity}</div>
                      <div style={styles.recentQtyLabel}>remaining</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <Box size={40} style={styles.emptyIcon} />
                <p style={styles.emptyText}>No scans yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanProduct;

