import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Scan, CheckCircle, AlertCircle, Package, ArrowLeft, Check, Layers, DollarSign, Ruler, Info } from 'lucide-react';
import { theme } from '../../theme';
import toast, { Toaster } from 'react-hot-toast';

const c = theme.colors;

const OrderScanning = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, findProductByBarcode, fulfillOrder, inventory } = useApp();
  const [order, setOrder] = useState(null);
  const [scannedItems, setScannedItems] = useState({});
  const [currentScan, setCurrentScan] = useState('');
  const [scanStatus, setScanStatus] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    const foundOrder = getOrderById(id);
    if (foundOrder) {
      setOrder(foundOrder);
      const initialScanned = {};
      foundOrder.products.forEach(p => { initialScanned[p.productId] = { needed: p.quantity, scanned: 0 }; });
      setScannedItems(initialScanned);
    } else { navigate('/employee-dashboard'); }
  }, [id, getOrderById, navigate]);

  useEffect(() => { if (isScanning && inputRef.current) inputRef.current.focus(); }, [isScanning, scanStatus]);

  const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '24px', minHeight: '100vh', padding: '24px', background: `linear-gradient(135deg, ${c.primary[50]} 0%, ${c.neutral[100]} 50%, ${c.primary[100]} 100%)` },
    header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' },
    backBtn: { display: 'flex', alignItems: 'center', gap: '8px', color: c.primary[700], background: 'none', border: 'none', fontSize: '15px', cursor: 'pointer', marginBottom: '8px', fontWeight: '600', transition: 'color 0.2s ease' },
    headerLeft: { flex: 1 },
    title: { fontSize: '36px', fontWeight: '800', color: c.primary[900], marginBottom: '8px' },
    orderMeta: { display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' },
    metaItem: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)', borderRadius: '10px', border: `1px solid ${c.primary[200]}`, boxShadow: '0 2px 8px rgba(21,42,17,0.05)' },
    metaLabel: { fontSize: '12px', color: c.primary[600], fontWeight: '600', textTransform: 'uppercase' },
    metaValue: { fontSize: '15px', color: c.primary[900], fontWeight: '700' },
    completeBtn: { display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 28px', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', backgroundColor: '#22c55e', color: '#FFFFFF', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 6px 24px rgba(34, 197, 94, 0.5)', transition: 'all 0.2s ease' },
    card: { backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderRadius: '20px', padding: '28px', border: `2px solid ${c.primary[200]}`, boxShadow: '0 6px 24px rgba(21,42,17,0.1)' },
    progressHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
    progressLabel: { fontSize: '15px', fontWeight: '700', color: c.primary[900] },
    progressPercent: { fontSize: '24px', fontWeight: '800', color: c.primary[700] },
    progressBar: { width: '100%', height: '20px', backgroundColor: c.primary[200], borderRadius: '10px', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' },
    progressFill: (percent) => ({ height: '100%', background: `linear-gradient(90deg, ${c.primary[500]} 0%, ${c.primary[600]} 50%, ${c.primary[700]} 100%)`, width: `${percent}%`, transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 0 15px rgba(61,106,75,0.4)', position: 'relative' }),
    scanSection: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' },
    scanIconWrapper: { width: '48px', height: '48px', borderRadius: '12px', background: `linear-gradient(135deg, ${c.primary[600]} 0%, ${c.primary[700]} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${c.primary[600]}40` },
    scanTitle: { fontSize: '22px', fontWeight: '800', color: c.primary[900] },
    scanInput: { width: '100%', padding: '18px 20px', fontSize: '18px', border: `2px solid ${c.primary[300]}`, borderRadius: '14px', color: c.neutral[900], backgroundColor: c.neutral.white, fontFamily: 'monospace', outline: 'none', transition: 'all 0.2s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
    statusBox: (type) => ({ marginTop: '18px', padding: '18px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: type === 'success' ? c.success[50] : type === 'error' ? c.error[50] : c.warning[50], border: `2px solid ${type === 'success' ? c.success[300] : type === 'error' ? c.error[300] : c.warning[300]}`, boxShadow: `0 4px 12px ${type === 'success' ? c.success[500] : type === 'error' ? c.error[500] : c.warning[500]}20` }),
    statusText: (type) => ({ fontWeight: '700', fontSize: '15px', color: type === 'success' ? c.success[700] : type === 'error' ? c.error[700] : c.warning[700] }),
    itemsTitle: { fontSize: '22px', fontWeight: '800', color: c.primary[900], marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' },
    itemCard: (isComplete) => ({ padding: '24px', borderRadius: '18px', border: `2px solid ${isComplete ? c.success[400] : c.primary[200]}`, background: isComplete ? `linear-gradient(135deg, ${c.success[50]} 0%, ${c.success[100]} 100%)` : 'white', marginBottom: '18px', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: isComplete ? `0 6px 20px ${c.success[500]}30` : '0 3px 14px rgba(21,42,17,0.08)', transform: isComplete ? 'scale(0.98)' : 'scale(1)' }),
    itemHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' },
    itemInfo: { display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 },
    checkIcon: (isComplete) => ({ width: '32px', height: '32px', borderRadius: '50%', background: isComplete ? `linear-gradient(135deg, ${c.success[500]} 0%, ${c.success[600]} 100%)` : c.primary[100], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: isComplete ? `0 4px 12px ${c.success[500]}40` : 'none', transition: 'all 0.3s ease' }),
    itemName: { fontSize: '19px', fontWeight: '800', color: c.primary[900], marginBottom: '6px', lineHeight: 1.3 },
    itemId: { fontSize: '13px', color: c.primary[600], fontFamily: 'monospace', marginBottom: '10px', letterSpacing: '0.5px' },
    itemDetails: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' },
    itemDetail: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: c.primary[700], background: `linear-gradient(135deg, ${c.primary[50]} 0%, ${c.primary[100]} 100%)`, padding: '8px 12px', borderRadius: '10px', border: `1px solid ${c.primary[200]}` },
    itemDetailLabel: { fontWeight: '700', color: c.primary[800] },
    itemCount: (isComplete) => ({ fontSize: '28px', fontWeight: '900', color: isComplete ? c.success[700] : c.primary[900], display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }),
    itemCountLabel: { fontSize: '11px', fontWeight: '700', color: c.primary[600], textTransform: 'uppercase', letterSpacing: '0.5px' },
    itemProgress: { width: '100%', height: '12px', backgroundColor: c.primary[200], borderRadius: '8px', overflow: 'hidden', marginTop: '14px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' },
    itemProgressFill: (percent, isComplete) => ({ height: '100%', background: isComplete ? `linear-gradient(90deg, ${c.success[400]} 0%, ${c.success[500]} 50%, ${c.success[600]} 100%)` : `linear-gradient(90deg, ${c.primary[500]} 0%, ${c.primary[600]} 50%, ${c.primary[700]} 100%)`, width: `${percent}%`, transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: `0 0 15px ${isComplete ? c.success[500] : c.primary[500]}50` }),
    loadingState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' },
    loadingIcon: { width: '64px', height: '64px', backgroundColor: c.primary[100], borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', animation: 'pulse 2s infinite' },
    loadingText: { color: c.primary[700] },
  };

  const handleScan = (e) => {
    e.preventDefault();
    if (!currentScan.trim()) return;
    
    const product = findProductByBarcode(currentScan);
    
    if (!product) { 
      toast.error('Product not found!', {
        icon: '❌',
        style: { background: c.error[50], color: c.error[700], border: `2px solid ${c.error[200]}`, fontWeight: '600' }
      });
      setScanStatus({ type: 'error', message: 'Product not found!' }); 
      setCurrentScan(''); 
      setTimeout(() => setScanStatus(null), 3000); 
      return; 
    }
    
    const orderProduct = order.products.find(p => p.productId === product.id);
    
    if (!orderProduct) { 
      toast.error('Product not in this order!', {
        icon: '⚠️',
        style: { background: c.error[50], color: c.error[700], border: `2px solid ${c.error[200]}`, fontWeight: '600' }
      });
      setScanStatus({ type: 'error', message: 'Product not in this order!' }); 
      setCurrentScan(''); 
      setTimeout(() => setScanStatus(null), 3000); 
      return; 
    }
    
    if (scannedItems[product.id].scanned >= scannedItems[product.id].needed) { 
      toast('Already scanned enough of this item!', {
        icon: '⚡',
        style: { background: c.warning[50], color: c.warning[700], border: `2px solid ${c.warning[200]}`, fontWeight: '600' }
      });
      setScanStatus({ type: 'warning', message: 'Already scanned enough of this item!' }); 
      setCurrentScan(''); 
      setTimeout(() => setScanStatus(null), 3000); 
      return; 
    }
    
    const newScannedCount = scannedItems[product.id].scanned + 1;
    const neededCount = scannedItems[product.id].needed;
    
    setScannedItems(prev => ({ 
      ...prev, 
      [product.id]: { 
        ...prev[product.id], 
        scanned: newScannedCount 
      } 
    }));
    
    toast.success(`Scanned: ${product.name} (${newScannedCount}/${neededCount})`, {
      icon: '✅',
      style: { background: c.success[50], color: c.success[700], border: `2px solid ${c.success[200]}`, fontWeight: '600' },
      duration: 2000
    });
    
    setScanStatus({ type: 'success', message: `Scanned: ${product.name}`, product });
    setCurrentScan('');
    
    // Check if this specific product is now complete
    if (newScannedCount === neededCount) {
      setTimeout(() => {
        toast.success(`${product.name} complete! ✨`, {
          icon: '🎉',
          style: { background: c.success[100], color: c.success[800], border: `2px solid ${c.success[300]}`, fontWeight: '700', fontSize: '16px' },
          duration: 3000
        });
      }, 300);
    }
    
    setTimeout(() => setScanStatus(null), 2000);
  };

  const isOrderComplete = () => Object.values(scannedItems).every(item => item.scanned >= item.needed);
  
  const handleComplete = () => { 
    if (isOrderComplete()) { 
      fulfillOrder(id); 
      toast.success('Order completed and moved to sales! 🎊', {
        icon: '🚀',
        style: { background: c.success[100], color: c.success[800], border: `2px solid ${c.success[400]}`, fontWeight: '700', fontSize: '18px' },
        duration: 4000
      });
      setTimeout(() => navigate('/employee-dashboard'), 1000);
    } 
  };
  if (!order) {
    return <div style={styles.loadingState}><div style={styles.loadingIcon}><Package size={28} color={c.primary[400]} /></div><p style={styles.loadingText}>Loading order...</p></div>;
  }

  const totalScanned = Object.values(scannedItems).reduce((sum, item) => sum + item.scanned, 0);
  const totalNeeded = Object.values(scannedItems).reduce((sum, item) => sum + item.needed, 0);
  const progress = (totalScanned / totalNeeded) * 100;
  const totalAmount = order.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

  return (
    <div style={styles.container}>
      <Toaster position="top-right" reverseOrder={false} />
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button onClick={() => navigate('/employee-dashboard')} style={styles.backBtn}>
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          <h1 style={styles.title}>Order #{order.id}</h1>
          <div style={styles.orderMeta}>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Designer</span>
              <span style={styles.metaValue}>{order.designerName}</span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Total Items</span>
              <span style={styles.metaValue}>{totalNeeded}</span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Total Amount</span>
              <span style={styles.metaValue}>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        {isOrderComplete() && (
          <button onClick={handleComplete} style={styles.completeBtn}>
            <Check size={20} /> Complete Order
          </button>
        )}
      </div>

      <div style={styles.card}>
        <div style={styles.progressHeader}>
          <span style={styles.progressLabel}>Overall Progress</span>
          <span style={styles.progressPercent}>{Math.round(progress)}%</span>
        </div>
        <div style={styles.progressBar}>
          <div style={styles.progressFill(progress)} />
        </div>
        <div style={{ marginTop: '12px', fontSize: '14px', color: c.primary[700], fontWeight: '600', textAlign: 'center' }}>
          {totalScanned} of {totalNeeded} items scanned
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.scanSection}>
          <div style={styles.scanIconWrapper}>
            <Scan size={24} color={c.neutral.white} />
          </div>
          <h2 style={styles.scanTitle}>Scan Barcode</h2>
        </div>
        <form onSubmit={handleScan}>
          <input 
            ref={inputRef} 
            type="text" 
            value={currentScan} 
            onChange={(e) => setCurrentScan(e.target.value)} 
            placeholder="Scan barcode or enter manually..." 
            disabled={!isScanning} 
            style={styles.scanInput} 
          />
        </form>
        {scanStatus && (
          <div style={styles.statusBox(scanStatus.type)}>
            {scanStatus.type === 'success' ? <CheckCircle size={26} color={c.success[600]} /> : <AlertCircle size={26} color={scanStatus.type === 'error' ? c.error[600] : c.warning[600]} />}
            <p style={styles.statusText(scanStatus.type)}>{scanStatus.message}</p>
          </div>
        )}
      </div>

      <div style={styles.card}>
        <h2 style={styles.itemsTitle}>
          <Package size={24} color={c.primary[700]} />
          Order Items ({order.products.length})
        </h2>
        {order.products.map((product) => {
          const scannedInfo = scannedItems[product.productId];
          const isComplete = scannedInfo && scannedInfo.scanned >= scannedInfo.needed;
          const progressPercent = scannedInfo ? (scannedInfo.scanned / scannedInfo.needed) * 100 : 0;
          const productDetails = inventory.find(p => p.id === product.productId);
          
          return (
            <div key={product.productId} style={styles.itemCard(isComplete)}>
              <div style={styles.itemHeader}>
                <div style={styles.itemInfo}>
                  <div style={styles.checkIcon(isComplete)}>
                    {isComplete ? <Check size={18} color={c.neutral.white} /> : <Package size={16} color={c.primary[600]} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={styles.itemName}>{product.name}</h3>
                    <p style={styles.itemId}>ID: {product.productId}</p>
                    {productDetails && (
                      <div style={styles.itemDetails}>
                        <div style={styles.itemDetail}>
                          <Ruler size={14} color={c.primary[600]} />
                          <span><span style={styles.itemDetailLabel}>Size:</span> {productDetails.size}</span>
                        </div>
                        <div style={styles.itemDetail}>
                          <DollarSign size={14} color={c.primary[600]} />
                          <span><span style={styles.itemDetailLabel}>Price:</span> ${product.price.toFixed(2)}</span>
                        </div>
                        <div style={styles.itemDetail}>
                          <Layers size={14} color={c.primary[600]} />
                          <span><span style={styles.itemDetailLabel}>Nursery:</span> {productDetails.nursery}</span>
                        </div>
                        <div style={styles.itemDetail}>
                          <Package size={14} color={c.primary[600]} />
                          <span><span style={styles.itemDetailLabel}>Stock:</span> {productDetails.quantity}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div style={styles.itemCount(isComplete)}>
                  <span style={styles.itemCountLabel}>SCANNED</span>
                  <span>{scannedInfo?.scanned || 0} / {product.quantity}</span>
                </div>
              </div>
              <div style={styles.itemProgress}><div style={styles.itemProgressFill(progressPercent, isComplete)} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderScanning;
