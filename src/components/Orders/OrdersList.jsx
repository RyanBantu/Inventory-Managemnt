import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import OrderCard from './OrderCard';

const OrdersList = () => {
  const navigate = useNavigate();
  const { orders } = useApp();

  const pendingOrders = orders.filter(order => order.status === 'pending');

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Orders</h1>
        <p className="text-slate-600">Manage and track all pending orders</p>
      </div>
      
      {pendingOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-slate-100">
          <p className="text-slate-500 text-lg">No pending orders</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingOrders.map((order, index) => (
            <div key={order.id}>
              <OrderCard
                order={order}
                onClick={() => navigate(`/orders/${order.id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;
