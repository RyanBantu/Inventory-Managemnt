import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import DesignerCard from './DesignerCard';
import { X, Calendar, FileText, DollarSign } from 'lucide-react';
import { formatDate, calculateTotal } from '../../utils/helpers';

const SalesHistory = () => {
  const { sales, getSalesByDesigner } = useApp();
  const [selectedDesigner, setSelectedDesigner] = useState(null);

  // Get unique designers
  const designers = [...new Set(sales.map(sale => sale.designerName))];

  const handleDesignerClick = (designerName) => {
    setSelectedDesigner(designerName);
  };

  const selectedSales = selectedDesigner ? getSalesByDesigner(selectedDesigner) : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Sales History</h1>
        <p className="text-slate-600">View sales performance by designer</p>
      </div>
      
      {sales.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-slate-100">
          <p className="text-slate-500 text-lg">No sales history available</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designers.map((designerName, index) => (
              <div key={designerName}>
                <DesignerCard
                  designerName={designerName}
                  sales={getSalesByDesigner(designerName)}
                  onClick={() => handleDesignerClick(designerName)}
                />
              </div>
            ))}
          </div>

          {/* Modal for selected designer */}
          {selectedDesigner && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedDesigner(null)}
            >
              <div
                className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl flex items-center justify-between z-10">
                  <h2 className="text-3xl font-bold">{selectedDesigner}'s Sales</h2>
                  <button
                    onClick={() => setSelectedDesigner(null)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-8 flex flex-col gap-6">
                  {selectedSales.map((sale) => {
                    const total = calculateTotal(sale.products);
                    return (
                      <div
                        key={sale.id}
                        className="border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all bg-white"
                      >
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <div className="flex items-center gap-3 text-slate-700 mb-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <span className="font-bold text-lg">Bill: {sale.billNumber}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(sale.completedAt)}</span>
                            </div>
                            <p className="text-slate-700 font-semibold">Client: {sale.clientName}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-green-600">
                              <DollarSign className="w-6 h-6" />
                              <span className="text-3xl font-bold">${total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-slate-200 pt-6 mt-6">
                          <h4 className="font-bold text-slate-900 mb-4 text-lg">Products:</h4>
                          <div className="flex flex-col gap-3">
                            {sale.products.map((product) => (
                              <div
                                key={product.productId}
                                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
                              >
                                <div>
                                  <p className="font-semibold text-slate-900">{product.name}</p>
                                  <p className="text-sm text-slate-600">
                                    {product.quantity} × ${product.price.toFixed(2)}
                                  </p>
                                </div>
                                <p className="font-bold text-slate-900 text-lg">
                                  ${(product.price * product.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SalesHistory;
