import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PackagePlus, 
  Package,
  ShoppingCart, 
  FileText, 
  TrendingUp,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/add-product', icon: PackagePlus, label: 'Add Product' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/create-order', icon: ShoppingCart, label: 'Create Order' },
    { path: '/orders', icon: FileText, label: 'Orders' },
    { path: '/sales', icon: TrendingUp, label: 'Sales History' },
    // { path: '/settings', icon: Settings, label: 'Data Management' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-72 bg-white/80 backdrop-blur-xl border-r border-blue-100 shadow-xl z-50">
      <div className="h-full flex flex-col">
        {/* Logo/Header */}
        <div className="p-8 border-b border-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Windscapes</h1>
              <p className="text-xs text-slate-500">Inventory Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 overflow-y-auto flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                  }`
                }
              >
                <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="font-semibold text-sm">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-blue-50">
          <p className="text-xs text-slate-400 text-center">© 2024 ERP System</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
