import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, Upload, Trash2, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { theme } from '../../theme';

const c = theme.colors;

const DataManagement = () => {
  const { exportData, importData, clearAllData, inventory, orders, sales } = useApp();
  const [importStatus, setImportStatus] = useState({ type: null, message: '' });
  const fileInputRef = useRef(null);

  const handleExport = () => {
    try { exportData(); setImportStatus({ type: 'success', message: 'Data exported successfully!' }); setTimeout(() => setImportStatus({ type: null, message: '' }), 3000); }
    catch (error) { setImportStatus({ type: 'error', message: 'Failed to export data' }); setTimeout(() => setImportStatus({ type: null, message: '' }), 3000); }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const success = importData(e.target.result);
        if (success) { setImportStatus({ type: 'success', message: 'Data imported successfully!' }); }
        else { setImportStatus({ type: 'error', message: 'Failed to import data. Please check the file format.' }); }
        setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
      } catch (error) { setImportStatus({ type: 'error', message: 'Error reading file: ' + error.message }); setTimeout(() => setImportStatus({ type: null, message: '' }), 3000); }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClear = () => { clearAllData(); setImportStatus({ type: 'success', message: 'All data cleared successfully!' }); setTimeout(() => setImportStatus({ type: null, message: '' }), 3000); };

  const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '24px' },
    header: { marginBottom: '24px' },
    title: { fontSize: '36px', fontWeight: '800', color: c.primary[900], marginBottom: '8px' },
    subtitle: { fontSize: '16px', color: c.neutral[500] },
    statusBox: (type) => ({ padding: '16px', borderRadius: '12px', border: `2px solid ${type === 'success' ? c.success[200] : c.error[200]}`, display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: type === 'success' ? c.success[50] : c.error[50], color: type === 'success' ? c.success[700] : c.error[700] }),
    statusText: { fontWeight: '600' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' },
    statCard: { backgroundColor: c.neutral.white, borderRadius: '12px', padding: '20px', border: `2px solid ${c.neutral[200]}` },
    statHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' },
    statLabel: { fontSize: '14px', fontWeight: '600', color: c.neutral[600] },
    statValue: { fontSize: '24px', fontWeight: '700', color: c.primary[900] },
    actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' },
    actionCard: { backgroundColor: c.neutral.white, borderRadius: '18px', padding: '24px', border: `1px solid ${c.neutral[200]}`, boxShadow: '0 1px 3px rgba(21,42,17,0.04)' },
    actionHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
    actionIcon: (bgColor) => ({ width: '48px', height: '48px', background: bgColor, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }),
    actionTitle: { fontWeight: '700', color: c.primary[900], fontSize: '18px' },
    actionSubtitle: { fontSize: '14px', color: c.neutral[600] },
    actionDesc: { fontSize: '14px', color: c.neutral[500], marginBottom: '16px', lineHeight: '1.5' },
    actionBtn: (bgColor) => ({ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 20px', background: bgColor, color: c.neutral.white, border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }),
    dangerBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 20px', backgroundColor: c.error[500], color: c.neutral.white, border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: `0 4px 12px ${c.error[500]}30` },
    fileInput: { display: 'none' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Data Management</h1>
        <p style={styles.subtitle}>Backup, restore, or manage your ERP data</p>
      </div>

      {importStatus.type && (
        <div style={styles.statusBox(importStatus.type)}>
          {importStatus.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span style={styles.statusText}>{importStatus.message}</span>
        </div>
      )}

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statHeader}><Database size={20} color={c.primary[500]} /><span style={styles.statLabel}>Products</span></div>
          <p style={styles.statValue}>{inventory.length}</p>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statHeader}><Database size={20} color={c.warning[500]} /><span style={styles.statLabel}>Orders</span></div>
          <p style={styles.statValue}>{orders.length}</p>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statHeader}><Database size={20} color={c.success[500]} /><span style={styles.statLabel}>Sales</span></div>
          <p style={styles.statValue}>{sales.length}</p>
        </div>
      </div>

      <div style={styles.actionsGrid}>
        <div style={styles.actionCard}>
          <div style={styles.actionHeader}>
            <div style={styles.actionIcon(`linear-gradient(135deg, ${c.primary[500]} 0%, ${c.primary[600]} 100%)`)}><Download size={24} color={c.neutral.white} /></div>
            <div><h3 style={styles.actionTitle}>Export Data</h3><p style={styles.actionSubtitle}>Download backup as JSON</p></div>
          </div>
          <p style={styles.actionDesc}>Export all your data (products, orders, sales) to a JSON file for backup purposes.</p>
          <button onClick={handleExport} style={styles.actionBtn(`linear-gradient(135deg, ${c.primary[500]} 0%, ${c.primary[600]} 100%)`)}><Download size={16} /> Export to JSON</button>
        </div>

        <div style={styles.actionCard}>
          <div style={styles.actionHeader}>
            <div style={styles.actionIcon(`linear-gradient(135deg, ${c.success[500]} 0%, ${c.success[600]} 100%)`)}><Upload size={24} color={c.neutral.white} /></div>
            <div><h3 style={styles.actionTitle}>Import Data</h3><p style={styles.actionSubtitle}>Restore from JSON backup</p></div>
          </div>
          <p style={styles.actionDesc}>Import data from a previously exported JSON file. This will replace all current data.</p>
          <label style={styles.actionBtn(`linear-gradient(135deg, ${c.success[500]} 0%, ${c.success[600]} 100%)`)}><Upload size={16} /> Import from JSON<input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} style={styles.fileInput} /></label>
        </div>

        <div style={styles.actionCard}>
          <div style={styles.actionHeader}>
            <div style={styles.actionIcon(`linear-gradient(135deg, ${c.error[500]} 0%, ${c.error[600]} 100%)`)}><Trash2 size={24} color={c.neutral.white} /></div>
            <div><h3 style={styles.actionTitle}>Clear Data</h3><p style={styles.actionSubtitle}>Reset all data</p></div>
          </div>
          <p style={styles.actionDesc}>Permanently delete all data from the system. This action cannot be undone.</p>
          <button onClick={() => { if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) handleClear(); }} style={styles.dangerBtn}><Trash2 size={16} /> Clear All Data</button>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
