import { Hash, Tag, Box, DollarSign, Calculator } from 'lucide-react';

const ProductForm = ({ product, onChange, onSubmit }) => {
  const handleChange = (field, value) => {
    onChange({ ...product, [field]: value });
  };


  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-6"
    >
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Add New Product</h2>
          <p className="text-slate-600">Fill in the product details below</p>
        </div>
        
        <div className="flex flex-col gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
              <Hash className="w-4 h-4 text-blue-500" />
              Product ID
            </label>
            <input
              type="text"
              value={product.id || ''}
              readOnly
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 cursor-not-allowed font-mono"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
              <Tag className="w-4 h-4 text-blue-500" />
              Item Name
            </label>
            <input
              type="text"
              value={product.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900 placeholder:text-slate-400"
              placeholder="Enter product name"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                <Box className="w-4 h-4 text-blue-500" />
                Quantity
              </label>
              <input
                type="number"
                value={product.quantity === 0 ? '' : (product.quantity ?? '')}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty string for typing
                  if (value === '') {
                    handleChange('quantity', '');
                  } else {
                    const qty = parseFloat(value);
                    if (!isNaN(qty) && qty >= 0) {
                      handleChange('quantity', qty);
                    }
                  }
                }}
                onBlur={(e) => {
                  // Ensure we have a valid number on blur
                  const value = e.target.value;
                  if (value === '' || value === null || value === undefined || isNaN(parseFloat(value))) {
                    handleChange('quantity', 0);
                  }
                }}
                required
                min="0"
                step="1"
                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900"
                placeholder="0"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                <DollarSign className="w-4 h-4 text-blue-500" />
                Base Price (per unit)
              </label>
              <input
                type="number"
                value={product.price === 0 ? '' : (product.price || '')}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    handleChange('price', '');
                  } else {
                    const price = parseFloat(value);
                    if (!isNaN(price) && price >= 0) {
                      handleChange('price', price);
                    }
                  }
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  if (value === '' || value === null || value === undefined || isNaN(parseFloat(value))) {
                    handleChange('price', 0);
                  }
                }}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
              <Calculator className="w-4 h-4 text-blue-500" />
              Rate (Percentage Markup)
            </label>
            <div className="relative">
              <input
                type="number"
                value={product.rate === 0 ? '' : (product.rate || '')}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    handleChange('rate', '');
                  } else {
                    const rate = parseFloat(value);
                    if (!isNaN(rate) && rate >= 0) {
                      handleChange('rate', rate);
                    }
                  }
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  if (value === '' || value === null || value === undefined || isNaN(parseFloat(value))) {
                    handleChange('rate', 0);
                  }
                }}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3.5 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-900"
                placeholder="0.00"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">%</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">This percentage will be added to the base price in bills</p>
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 font-semibold text-lg"
        >
          Add Product to Inventory
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
