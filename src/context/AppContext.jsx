import { createContext, useContext, useState, useEffect } from 'react';
import { generateProductId, generateOrderId, generateBillNumber } from '../utils/helpers';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedInventory = localStorage.getItem('erp_inventory');
      const savedOrders = localStorage.getItem('erp_orders');
      const savedSales = localStorage.getItem('erp_sales');

      if (savedInventory) {
        const parsed = JSON.parse(savedInventory);
        if (Array.isArray(parsed)) {
          setInventory(parsed);
        }
      }
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) {
          setOrders(parsed);
        }
      }
      if (savedSales) {
        const parsed = JSON.parse(savedSales);
        if (Array.isArray(parsed)) {
          setSales(parsed);
        }
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever state changes (only after initial load)
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('erp_inventory', JSON.stringify(inventory));
      } catch (error) {
        console.error('Error saving inventory to localStorage:', error);
      }
    }
  }, [inventory, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('erp_orders', JSON.stringify(orders));
      } catch (error) {
        console.error('Error saving orders to localStorage:', error);
      }
    }
  }, [orders, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('erp_sales', JSON.stringify(sales));
      } catch (error) {
        console.error('Error saving sales to localStorage:', error);
      }
    }
  }, [sales, isLoaded]);

  // Inventory functions
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: generateProductId(inventory),
    };
    setInventory([...inventory, newProduct]);
    return newProduct;
  };

  const updateInventory = (productId, quantity) => {
    setInventory(prevInventory => 
      prevInventory.map(item => 
        item.id === productId 
          ? { ...item, quantity: Math.max(0, item.quantity - quantity) }
          : item
      )
    );
  };

  // Order functions
  const createOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: generateOrderId(orders),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setOrders([...orders, newOrder]);
    return newOrder;
  };

  const updateOrder = (orderId, updatedData) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, ...updatedData }
        : order
    ));
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  // Sales functions
  const completeOrder = (orderId, billNumber) => {
    const order = getOrderById(orderId);
    if (!order) return;

    // Update inventory
    order.products.forEach(product => {
      updateInventory(product.productId, product.quantity);
    });

    // Move to sales
    const sale = {
      ...order,
      billNumber,
      status: 'completed',
      completedAt: new Date().toISOString(),
    };

    setSales([...sales, sale]);
    setOrders(orders.filter(o => o.id !== orderId));
    return sale;
  };

  const getSalesByDesigner = (designerName) => {
    return sales.filter(sale => sale.designerName === designerName);
  };

  // Stats functions
  const getStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    const todayOrders = orders.filter(o => o.createdAt?.split('T')[0] === today);
    const weekOrders = orders.filter(o => o.createdAt?.split('T')[0] >= weekAgoStr);
    
    const todaySales = sales.filter(s => s.completedAt?.split('T')[0] === today);
    const weekSales = sales.filter(s => s.completedAt?.split('T')[0] >= weekAgoStr);

    const todaySalesTotal = todaySales.reduce((sum, s) => {
      return sum + s.products.reduce((pSum, p) => pSum + (p.price * p.quantity), 0);
    }, 0);

    const weekSalesTotal = weekSales.reduce((sum, s) => {
      return sum + s.products.reduce((pSum, p) => pSum + (p.price * p.quantity), 0);
    }, 0);

    return {
      totalProducts: inventory.length,
      todayOrders: todayOrders.length,
      weekOrders: weekOrders.length,
      todaySales: todaySalesTotal,
      weekSales: weekSalesTotal,
      pendingOrders: orders.length,
    };
  };

  // Export/Import functions for JSON backup
  const exportData = () => {
    const data = {
      inventory,
      orders,
      sales,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `erp-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return data;
  };

  const importData = (jsonData) => {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (data.inventory && Array.isArray(data.inventory)) {
        setInventory(data.inventory);
      }
      if (data.orders && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
      if (data.sales && Array.isArray(data.sales)) {
        setSales(data.sales);
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone!')) {
      setInventory([]);
      setOrders([]);
      setSales([]);
      localStorage.removeItem('erp_inventory');
      localStorage.removeItem('erp_orders');
      localStorage.removeItem('erp_sales');
    }
  };

  const value = {
    inventory,
    orders,
    sales,
    addProduct,
    updateInventory,
    createOrder,
    updateOrder,
    getOrderById,
    completeOrder,
    getSalesByDesigner,
    getStats,
    generateBillNumber: () => generateBillNumber(sales),
    exportData,
    importData,
    clearAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
