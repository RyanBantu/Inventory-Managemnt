import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Download, CheckCircle, FileText } from 'lucide-react';
import { generateBillPDF } from '../../utils/pdfGenerator';
import { calculateTotal, formatDate } from '../../utils/helpers';
import { theme } from '../../theme';

const c = theme.colors;

const Bill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, completeOrder, generateBillNumber } = useApp();
  const order = getOrderById(id);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [billNumber, setBillNumber] = useState('');

  useEffect(() => { if (order && !billNumber) setBillNumber(generateBillNumber()); }, [order, billNumber, generateBillNumber]);

  const styles = {
    container: { maxWidth: '1024px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' },
    title: { fontSize: '36px', fontWeight: '800', color: c.primary[900], marginBottom: '8px' },
    subtitle: { fontSize: '16px', color: c.neutral[500] },
    btnGroup: { display: 'flex', gap: '12px' },
    btnPrimary: { display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px', backgroundColor: c.primary[500], color: c.neutral.white, border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: `0 4px 12px ${c.primary[500]}30` },
    btnSuccess: (enabled) => ({ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px', background: enabled ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : '#d4d4d8', backgroundColor: enabled ? '#22c55e' : '#d4d4d8', color: enabled ? '#FFFFFF' : '#71717a', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: enabled ? 'pointer' : 'not-allowed', boxShadow: enabled ? '0 4px 12px rgba(34, 197, 94, 0.3)' : 'none' }),
    card: { backgroundColor: c.neutral.white, borderRadius: '18px', border: `1px solid ${c.neutral[200]}`, overflow: 'hidden', boxShadow: `0 4px 20px ${c.primary[900]}10` },
    invoiceHeader: { background: `linear-gradient(135deg, ${c.primary[600]} 0%, ${c.primary[800]} 100%)`, color: c.neutral.white, padding: '32px' },
    invoiceHeaderContent: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    invoiceTitle: { fontSize: '36px', fontWeight: '800', marginBottom: '12px' },
    billNumberRow: { display: 'flex', alignItems: 'center', gap: '8px', color: c.primary[100] },
    dateText: { fontSize: '18px', color: c.primary[100] },
    invoiceBody: { padding: '32px' },
    sectionTitle: { fontSize: '13px', fontWeight: '700', color: c.neutral[700], marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    billToBox: { backgroundColor: c.neutral[50], borderRadius: '12px', padding: '20px', border: `1px solid ${c.neutral[200]}`, marginBottom: '32px' },
    clientName: { fontSize: '18px', fontWeight: '600', color: c.primary[900], marginBottom: '4px' },
    designerName: { fontSize: '15px', fontWeight: '500', color: c.neutral[700] },
    table: { width: '100%', borderCollapse: 'collapse', border: `1px solid ${c.neutral[200]}`, borderRadius: '12px', overflow: 'hidden', marginBottom: '32px' },
    th: { padding: '16px 24px', backgroundColor: c.primary[50], fontSize: '14px', fontWeight: '700', color: c.primary[800], textAlign: 'left' },
    thCenter: { padding: '16px 24px', backgroundColor: c.primary[50], fontSize: '14px', fontWeight: '700', color: c.primary[800], textAlign: 'center' },
    thRight: { padding: '16px 24px', backgroundColor: c.primary[50], fontSize: '14px', fontWeight: '700', color: c.primary[800], textAlign: 'right' },
    td: { padding: '16px 24px', borderTop: `1px solid ${c.neutral[100]}` },
    tdCenter: { padding: '16px 24px', borderTop: `1px solid ${c.neutral[100]}`, textAlign: 'center', color: c.neutral[600] },
    tdRight: { padding: '16px 24px', borderTop: `1px solid ${c.neutral[100]}`, textAlign: 'right' },
    productName: { fontWeight: '600', color: c.primary[900] },
    productTotal: { fontWeight: '700', color: c.primary[900] },
    totalsBox: { backgroundColor: c.neutral[50], borderRadius: '12px', padding: '24px', border: `1px solid ${c.neutral[200]}` },
    totalRow: { display: 'flex', justifyContent: 'space-between', fontWeight: '500', color: c.neutral[700], marginBottom: '12px' },
    grandTotalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: `2px solid ${c.neutral[300]}` },
    grandTotalLabel: { fontSize: '20px', fontWeight: '700', color: c.primary[900] },
    grandTotalValue: { fontSize: '36px', fontWeight: '800', color: c.primary[600] },
    footer: { marginTop: '32px', paddingTop: '24px', borderTop: `1px solid ${c.neutral[200]}`, textAlign: 'center' },
    footerText: { fontSize: '15px', fontWeight: '500', color: c.neutral[500] },
    emptyState: { textAlign: 'center', padding: '48px', color: c.neutral[500] },
  };

  if (!order) return <div style={styles.emptyState}><p>Order not found</p></div>;

  const subtotal = calculateTotal(order.products);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handlePrintBill = () => { generateBillPDF(order, billNumber); setPdfDownloaded(true); };
  const handleMarkPaid = () => { 
    completeOrder(id, billNumber); 
    alert('Order marked as paid and sent to employee dashboard!'); 
    navigate('/orders'); 
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Invoice</h1>
          <p style={styles.subtitle}>Review and finalize the bill</p>
        </div>
        <div style={styles.btnGroup}>
          <button onClick={handlePrintBill} style={styles.btnPrimary}><Download size={20} /> Print Bill</button>
          <button onClick={handleMarkPaid} disabled={!pdfDownloaded} style={styles.btnSuccess(pdfDownloaded)}><CheckCircle size={20} /> Mark as Paid</button>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.invoiceHeader}>
          <div style={styles.invoiceHeaderContent}>
            <div>
              <h2 style={styles.invoiceTitle}>INVOICE</h2>
              <div style={styles.billNumberRow}><FileText size={20} /><span style={{ fontWeight: '600' }}>Bill No: {billNumber}</span></div>
            </div>
            <div style={{ textAlign: 'right' }}><p style={styles.dateText}>Date: {formatDate(new Date().toISOString())}</p></div>
          </div>
        </div>

        <div style={styles.invoiceBody}>
          <div style={{ marginBottom: '32px' }}>
            <h3 style={styles.sectionTitle}>Bill To:</h3>
            <div style={styles.billToBox}>
              <p style={styles.clientName}>Client: {order.clientName}</p>
              <p style={styles.designerName}>Designer: {order.designerName}</p>
            </div>
          </div>

          <table style={styles.table}>
            <thead>
              <tr><th style={styles.th}>Product</th><th style={styles.thCenter}>Quantity</th><th style={styles.thRight}>Unit Price</th><th style={styles.thRight}>Total</th></tr>
            </thead>
            <tbody>
              {order.products.map((product, index) => (
                <tr key={product.productId} style={{ backgroundColor: index % 2 === 0 ? c.neutral.white : c.neutral[50] }}>
                  <td style={styles.td}><span style={styles.productName}>{product.name}</span></td>
                  <td style={styles.tdCenter}>{product.quantity}</td>
                  <td style={{ ...styles.tdRight, color: c.neutral[600] }}>${product.price.toFixed(2)}</td>
                  <td style={styles.tdRight}><span style={styles.productTotal}>${(product.price * product.quantity).toFixed(2)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.totalsBox}>
            <div style={styles.totalRow}><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
            <div style={styles.totalRow}><span>Tax (10%):</span><span>${tax.toFixed(2)}</span></div>
            <div style={styles.grandTotalRow}><span style={styles.grandTotalLabel}>Total:</span><span style={styles.grandTotalValue}>${total.toFixed(2)}</span></div>
          </div>

          <div style={styles.footer}><p style={styles.footerText}>Thank you for your business!</p></div>
        </div>
      </div>
    </div>
  );
};

export default Bill;
