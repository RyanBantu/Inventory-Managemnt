import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Package, Search, X } from 'lucide-react';

const Products = () => {
  const { inventory } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
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

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Products</h1>
        <p className="text-slate-600">View all products in your inventory</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
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
        {searchQuery && (
          <p className="text-sm text-slate-500 mt-3 ml-1">
            Found {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} matching "{searchQuery}"
          </p>
        )}
      </div>

      {inventory.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-lg text-slate-500 mb-2">No products found</p>
          <p className="text-sm text-slate-400">Add your first product to get started</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-lg text-slate-500 mb-2">No products found</p>
          <p className="text-sm text-slate-400">Try adjusting your search query</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b-2 border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Base Price</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Markup</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Final Price</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product, index) => {
                  const finalPrice = (product.price || 0) * (1 + (product.rate || 0) / 100);
                  const totalValue = (product.quantity || 0) * finalPrice;
                  
                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-blue-50/30 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold text-slate-900 text-sm">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded">
                          {product.id}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-slate-900">{product.quantity || 0}</span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-700">
                        ${(product.price || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-slate-700 font-medium">{(product.rate || 0)}%</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-blue-600">${finalPrice.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-bold text-slate-900">${totalValue.toFixed(2)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Summary Footer */}
          {filteredProducts.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-t-2 border-slate-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">
                  Total Products: {filteredProducts.length}
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  Total Inventory Value: <span className="text-blue-600 font-bold">
                    ${filteredProducts.reduce((sum, p) => {
                      const fp = (p.price || 0) * (1 + (p.rate || 0) / 100);
                      return sum + ((p.quantity || 0) * fp);
                    }, 0).toFixed(2)}
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
