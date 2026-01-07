import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import AddProduct from './components/Inventory/AddProduct';
import Products from './components/Inventory/Products';
import CreateOrder from './components/Orders/CreateOrder';
import OrdersList from './components/Orders/OrdersList';
import OrderDetails from './components/Orders/OrderDetails';
import Bill from './components/Billing/Bill';
import SalesHistory from './components/Sales/SalesHistory';
import DataManagement from './components/Settings/DataManagement';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="products" element={<Products />} />
            <Route path="create-order" element={<CreateOrder />} />
            <Route path="orders" element={<OrdersList />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="bill/:id" element={<Bill />} />
            <Route path="sales" element={<SalesHistory />} />
            <Route path="settings" element={<DataManagement />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
