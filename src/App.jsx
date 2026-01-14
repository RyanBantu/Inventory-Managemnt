import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import AddProduct from './components/Inventory/AddProduct';
import Products from './components/Inventory/Products';
import ScanProduct from './components/Inventory/ScanProduct';
import CreateOrder from './components/Orders/CreateOrder';
import OrdersList from './components/Orders/OrdersList';
import OrderDetails from './components/Orders/OrderDetails';
import Bill from './components/Billing/Bill';
import SalesHistory from './components/Sales/SalesHistory';
import DataManagement from './components/Settings/DataManagement';
import EmployeeDashboard from './components/Employee/EmployeeDashboard';
import OrderScanning from './components/Employee/OrderScanning';

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useApp();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function AppRoutes() {
  const { user } = useApp();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={user?.role === 'employee' ? <Navigate to="/employee-dashboard" replace /> : <Dashboard />} />
        
        {/* Admin routes */}
        <Route path="add-product" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AddProduct />
          </ProtectedRoute>
        } />
        <Route path="products" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Products />
          </ProtectedRoute>
        } />
        <Route path="scan-product" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ScanProduct />
          </ProtectedRoute>
        } />
        <Route path="create-order" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CreateOrder />
          </ProtectedRoute>
        } />
        <Route path="orders" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <OrdersList />
          </ProtectedRoute>
        } />
        <Route path="orders/:id" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <OrderDetails />
          </ProtectedRoute>
        } />
        <Route path="bill/:id" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Bill />
          </ProtectedRoute>
        } />
        <Route path="sales" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <SalesHistory />
          </ProtectedRoute>
        } />
        <Route path="settings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DataManagement />
          </ProtectedRoute>
        } />
        
        {/* Employee routes */}
        <Route path="employee-dashboard" element={
          <ProtectedRoute allowedRoles={['employee']}>
            <EmployeeDashboard />
          </ProtectedRoute>
        } />
        <Route path="order-scanning/:id" element={
          <ProtectedRoute allowedRoles={['employee']}>
            <OrderScanning />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
