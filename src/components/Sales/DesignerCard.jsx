import { TrendingUp, User, DollarSign, Package } from 'lucide-react';

const DesignerCard = ({ designerName, sales, onClick }) => {
  const totalRevenue = sales.reduce((sum, sale) => {
    return sum + sale.products.reduce((pSum, p) => pSum + (p.price * p.quantity), 0);
  }, 0);

  const totalProducts = sales.reduce((sum, sale) => {
    return sum + sale.products.reduce((pSum, p) => pSum + p.quantity, 0);
  }, 0);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-300 cursor-pointer transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{designerName}</h3>
            <p className="text-sm text-slate-500">{sales.length} sale{sales.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <TrendingUp className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center gap-2 text-green-700 text-sm font-semibold mb-2">
            <DollarSign className="w-4 h-4" />
            <span>Revenue</span>
          </div>
          <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 text-blue-700 text-sm font-semibold mb-2">
            <Package className="w-4 h-4" />
            <span>Products</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{totalProducts}</p>
        </div>
      </div>
    </div>
  );
};

export default DesignerCard;
