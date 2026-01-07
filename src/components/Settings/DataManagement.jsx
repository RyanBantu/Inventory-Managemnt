import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, Upload, Trash2, Database, CheckCircle, AlertCircle } from 'lucide-react';

const DataManagement = () => {
  const { exportData, importData, clearAllData, inventory, orders, sales } = useApp();
  const [importStatus, setImportStatus] = useState({ type: null, message: '' });
  const fileInputRef = useRef(null);

  const handleExport = () => {
    try {
      exportData();
      setImportStatus({ type: 'success', message: 'Data exported successfully!' });
      setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
    } catch (error) {
      setImportStatus({ type: 'error', message: 'Failed to export data' });
      setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target.result;
        const success = importData(jsonData);
        if (success) {
          setImportStatus({ type: 'success', message: 'Data imported successfully!' });
          setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
        } else {
          setImportStatus({ type: 'error', message: 'Failed to import data. Please check the file format.' });
          setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
        }
      } catch (error) {
        setImportStatus({ type: 'error', message: 'Error reading file: ' + error.message });
        setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    clearAllData();
    setImportStatus({ type: 'success', message: 'All data cleared successfully!' });
    setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Data Management</h1>
        <p className="text-slate-600">Backup, restore, or manage your ERP data</p>
      </div>

      {/* Status Message */}
      {importStatus.type && (
        <div
          className={`p-4 rounded-xl border-2 flex items-center gap-3 ${
            importStatus.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {importStatus.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-semibold">{importStatus.message}</span>
        </div>
      )}

      {/* Data Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border-2 border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold text-slate-600">Products</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{inventory.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border-2 border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-semibold text-slate-600">Orders</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border-2 border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-5 h-5 text-green-500" />
            <span className="text-sm font-semibold text-slate-600">Sales</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{sales.length}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Export */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Export Data</h3>
              <p className="text-sm text-slate-600">Download backup as JSON</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Export all your data (products, orders, sales) to a JSON file for backup purposes.
          </p>
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-semibold shadow-md hover:shadow-lg"
          >
            <Download className="w-4 h-4" />
            Export to JSON
          </button>
        </div>

        {/* Import */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Import Data</h3>
              <p className="text-sm text-slate-600">Restore from JSON backup</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Import data from a previously exported JSON file. This will replace all current data.
          </p>
          <label className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold shadow-md hover:shadow-lg cursor-pointer">
            <Upload className="w-4 h-4" />
            Import from JSON
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        {/* Clear Data */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Clear All Data</h3>
              <p className="text-sm text-slate-600">Delete everything</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            <span className="font-semibold text-red-600">Warning:</span> This will permanently delete all products, orders, and sales data.
          </p>
          <button
            onClick={handleClear}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-semibold shadow-md hover:shadow-lg"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Data
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Database className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">About Data Storage</h4>
            <p className="text-sm text-blue-700">
              Your data is automatically saved to browser localStorage. This means your data persists between sessions,
              but it's specific to this browser. For long-term backup, use the Export feature to download a JSON file.
              You can restore this backup anytime using the Import feature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
