import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Download, CheckCircle, FileText } from 'lucide-react';
import { generateBillPDF } from '../../utils/pdfGenerator';
import { calculateTotal, formatDate } from '../../utils/helpers';

const Bill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, completeOrder, generateBillNumber } = useApp();
  const order = getOrderById(id);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [billNumber, setBillNumber] = useState('');

  useEffect(() => {
    if (order && !billNumber) {
      setBillNumber(generateBillNumber());
    }
  }, [order, billNumber, generateBillNumber]);

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Order not found</p>
      </div>
    );
  }

  const subtotal = calculateTotal(order.products);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handlePrintBill = () => {
    generateBillPDF(order, billNumber);
    setPdfDownloaded(true);
  };

  const handleMarkPaid = () => {
    completeOrder(id, billNumber);
    alert('Order marked as paid!');
    navigate('/sales');
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Invoice</h1>
          <p className="text-slate-600">Review and finalize the bill</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePrintBill}
            className="flex items-center gap-2 px-6 py-3.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 font-semibold"
          >
            <Download className="w-5 h-5" />
            Print Bill
          </button>
          <button
            onClick={handleMarkPaid}
            disabled={!pdfDownloaded}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl transition-all shadow-lg font-semibold ${
              pdfDownloaded
                ? 'bg-green-500 text-white hover:bg-green-600 shadow-green-500/30'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            Mark as Paid
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold mb-3">INVOICE</h2>
              <div className="flex items-center gap-2 text-blue-100">
                <FileText className="w-5 h-5" />
                <span className="font-semibold">Bill No: {billNumber}</span>
              </div>
            </div>
            <div className="text-right text-blue-100">
              <p className="text-lg">Date: {formatDate(new Date().toISOString())}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Bill To */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Bill To:</h3>
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <p className="text-slate-900 font-semibold text-lg mb-1">Client: {order.clientName}</p>
              <p className="text-slate-700 font-medium">Designer: {order.designerName}</p>
            </div>
          </div>

          {/* Products Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-8">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-blue-100/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Product</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">Quantity</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">Unit Price</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((product, index) => (
                  <tr
                    key={product.productId}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                  >
                    <td className="px-6 py-4 text-slate-900 font-semibold">{product.name}</td>
                    <td className="px-6 py-4 text-center text-slate-600">{product.quantity}</td>
                    <td className="px-6 py-4 text-right text-slate-600">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      ${(product.price * product.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex flex-col gap-3 bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="flex justify-between text-slate-700 font-medium">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-700 font-medium">
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t-2 border-slate-300">
              <span className="text-xl font-bold text-slate-900">Total:</span>
              <span className="text-4xl font-bold text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-slate-500 font-medium">Thank you for your business!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bill;
