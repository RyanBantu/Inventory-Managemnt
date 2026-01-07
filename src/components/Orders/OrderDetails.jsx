import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Edit, Save, Receipt, Trash2, Plus, Minus } from 'lucide-react';
import { calculateTotal } from '../../utils/helpers';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, updateOrder } = useApp();
  const order = getOrderById(id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [designerName, setDesignerName] = useState('');
  const [clientName, setClientName] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (order) {
      setDesignerName(order.designerName);
      setClientName(order.clientName);
      setProducts([...order.products]);
    }
  }, [order]);

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Order not found</p>
      </div>
    );
  }

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveProduct(productId);
      return;
    }
    setProducts(products.map(p =>
      p.productId === productId ? { ...p, quantity: newQty } : p
    ));
  };

  const handleRemoveProduct = (productId) => {
    setProducts(products.filter(p => p.productId !== productId));
  };

  const handleUpdateOrder = () => {
    updateOrder(id, {
      designerName,
      clientName,
      products,
    });
    setIsEditing(false);
    alert('Order updated successfully!');
  };

  const handleGenerateBill = () => {
    navigate(`/bill/${id}`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Order Details</h1>
          <p className="text-slate-600">View and edit order information</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <button
              onClick={handleUpdateOrder}
              className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/30 font-semibold"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 font-semibold"
            >
              <Edit className="w-4 h-4" />
              Edit Order
            </button>
          )}
          <button
            onClick={handleGenerateBill}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30 font-semibold"
          >
            <Receipt className="w-4 h-4" />
            Generate Bill
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-3 block">Designer Name</label>
            {isEditing ? (
              <input
                type="text"
                value={designerName}
                onChange={(e) => setDesignerName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
              />
            ) : (
              <p className="text-lg text-slate-900 font-semibold">{designerName}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-3 block">Client Name</label>
            {isEditing ? (
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
              />
            ) : (
              <p className="text-lg text-slate-900 font-semibold">{clientName}</p>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900">Products ({products.length})</h3>
          </div>
          
          {/* Compact Table View */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-blue-100/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Product</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-slate-700">Quantity</th>
                  <th className="px-4 py-3 text-right text-sm font-bold text-slate-700">Unit Price</th>
                  <th className="px-4 py-3 text-right text-sm font-bold text-slate-700">Total</th>
                  {isEditing && (
                    <th className="px-4 py-3 text-center text-sm font-bold text-slate-700 w-20">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr
                    key={product.productId}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30 hover:bg-slate-100/50 transition-colors'}
                  >
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900">{product.name}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(product.productId, product.quantity - 1)}
                            className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition-all"
                            title="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) => handleUpdateQuantity(product.productId, parseInt(e.target.value) || 1)}
                            className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-center font-semibold text-sm"
                          />
                          <button
                            onClick={() => handleUpdateQuantity(product.productId, product.quantity + 1)}
                            className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition-all"
                            title="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-semibold text-slate-700">{product.quantity}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-slate-900">
                        ${(product.price * product.quantity).toFixed(2)}
                      </span>
                    </td>
                    {isEditing && (
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleRemoveProduct(product.productId)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                          title="Remove product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-5 border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-slate-700">Total Amount:</span>
              <span className="text-3xl font-bold text-blue-600">
                ${calculateTotal(products).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
