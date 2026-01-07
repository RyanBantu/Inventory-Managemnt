import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { User, Users, ShoppingCart, CheckCircle, Plus, Minus, Package, DollarSign, Percent, Hash, X, Box, Calculator, Search } from 'lucide-react';
import { calculateTotal } from '../../utils/helpers';

const CreateOrder = () => {
  const navigate = useNavigate();
  const { inventory, createOrder } = useApp();
  const [designerName, setDesignerName] = useState('');
  const [clientName, setClientName] = useState('');
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInventory = useMemo(() => {
    if (!searchQuery.trim()) {
      return inventory;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return inventory.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.id.toLowerCase().includes(query) ||
      (product.price && product.price.toString().includes(query)) ||
      (product.rate && product.rate.toString().includes(query))
    );
  }, [inventory, searchQuery]);

  const handleAddToCart = (product) => {
    const qty = parseInt(quantities[product.id] || 1);
    if (qty <= 0 || qty > product.quantity) {
      alert(`Invalid quantity. Available: ${product.quantity}`);
      return;
    }

    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + qty }
          : item
      ));
    } else {
      // Calculate final price with percentage markup
      const basePrice = product.price || 0;
      const ratePercent = product.rate || 0;
      const finalPrice = basePrice * (1 + ratePercent / 100);
      
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        quantity: qty,
        price: finalPrice, // Price with markup applied
        basePrice: basePrice, // Store original base price
        rate: ratePercent, // Store rate for reference
      }]);
    }
    setQuantities({ ...quantities, [product.id]: '' });
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQty }
        : item
    ));
  };

  const handleCreateOrder = () => {
    if (!designerName || !clientName) {
      alert('Please enter designer and client names');
      return;
    }
    if (cart.length === 0) {
      alert('Please add at least one product to cart');
      return;
    }

    createOrder({
      designerName,
      clientName,
      products: cart,
    });

    alert('Order created successfully!');
    navigate('/orders');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Create New Order</h1>
        <p className="text-slate-600">Select products and add them to your cart</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Product Selection */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Information</h2>
            <div className="flex flex-col gap-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                  <User className="w-4 h-4 text-blue-500" />
                  Designer Name
                </label>
                <input
                  type="text"
                  value={designerName}
                  onChange={(e) => setDesignerName(e.target.value)}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900"
                  placeholder="Enter designer name"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                  <Users className="w-4 h-4 text-blue-500" />
                  Client Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900"
                  placeholder="Enter client name"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Available Products</h2>
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
                {filteredInventory.length} {filteredInventory.length === 1 ? 'product' : 'products'}
                {searchQuery && ` (of ${inventory.length})`}
              </span>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by name, ID, price, or rate..."
                  className="w-full pl-12 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2">
              {inventory.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg font-medium">No products available</p>
                  <p className="text-slate-400 text-sm mt-1">Add products first to create orders</p>
                </div>
              ) : filteredInventory.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg font-medium">No products found</p>
                  <p className="text-slate-400 text-sm mt-1">Try adjusting your search query</p>
                </div>
              ) : (
                filteredInventory.map((product) => {
                  const finalPrice = (product.price || 0) * (1 + (product.rate || 0) / 100);
                  return (
                    <div
                      key={product.id}
                      className="group p-5 border-2 border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-slate-50/50"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-slate-900 text-lg">{product.name}</h3>
                              <span className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded">
                                {product.id}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Box className="w-4 h-4 text-blue-500" />
                                <span className="text-slate-600">Stock:</span>
                                <span className="font-bold text-slate-900">{product.quantity || 0}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <DollarSign className="w-4 h-4 text-green-500" />
                                <span className="text-slate-600">Base:</span>
                                <span className="font-semibold text-slate-900">${(product.price || 0).toFixed(2)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Percent className="w-4 h-4 text-orange-500" />
                                <span className="text-slate-600">Markup:</span>
                                <span className="font-semibold text-slate-900">{product.rate || 0}%</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Calculator className="w-4 h-4 text-blue-600" />
                                <span className="text-slate-600">Price:</span>
                                <span className="font-bold text-blue-600">${finalPrice.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Add to Cart Section */}
                      <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-2 flex-1">
                          <label className="text-sm font-medium text-slate-700">Quantity:</label>
                          <input
                            type="number"
                            min="1"
                            max={product.quantity}
                            value={quantities[product.id] || ''}
                            onChange={(e) => setQuantities({ ...quantities, [product.id]: e.target.value })}
                            className="w-20 px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 font-semibold text-center"
                            placeholder="1"
                          />
                          <span className="text-xs text-slate-500">max: {product.quantity}</span>
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-semibold shadow-md hover:shadow-lg"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Cart */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-100 sticky top-8 overflow-hidden">
            {/* Cart Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {/* <ShoppingCart className="w-5 h-5" /> */}
                  Current List
                </h2>
                {cart.length > 0 && (
                  <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {cart.length} {cart.length === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>
              {cart.length > 0 && (
                <p className="text-blue-100 text-sm">Review your order before checkout</p>
              )}
            </div>

            {/* Cart Content */}
            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium mb-1">Your cart is empty</p>
                  <p className="text-slate-400 text-sm">Add products from the left to get started</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-3 max-h-[450px] overflow-y-auto mb-6 pr-2">
                    {cart.map((item) => (
                      <div
                        key={item.productId}
                        className="group p-4 border-2 border-slate-200 rounded-xl bg-gradient-to-br from-white to-slate-50/50 hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900 text-sm mb-1">{item.name}</h4>
                            <p className="text-xs text-slate-500">${item.price.toFixed(2)} per unit</p>
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(item.productId)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="Remove item"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-blue-100 text-blue-600 transition-all font-bold"
                              title="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-bold text-slate-900 w-10 text-center bg-slate-50 px-2 py-1 rounded">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-blue-100 text-blue-600 transition-all font-bold"
                              title="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500 mb-1">Subtotal</p>
                            <p className="font-bold text-slate-900 text-lg">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cart Summary */}
                  <div className="border-t-2 border-slate-200 pt-6 space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-700">Subtotal</span>
                        <span className="font-semibold text-slate-900">
                          ${calculateTotal(cart).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                        <span className="text-lg font-bold text-slate-900">Total</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ${calculateTotal(cart).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleCreateOrder}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 font-semibold text-lg"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Create Order
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
