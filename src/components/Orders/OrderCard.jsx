import { Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { calculateTotal } from '../../utils/helpers';

const OrderCard = ({ order, onClick }) => {
  const total = calculateTotal(order.products);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-300 cursor-pointer transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-1">{order.designerName}</h3>
          <p className="text-slate-600">Client: <span className="font-semibold text-slate-900">{order.clientName}</span></p>
        </div>
        <ArrowRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(order.createdAt)}</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 mb-1">Total</p>
          <p className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
