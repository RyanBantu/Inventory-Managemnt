import { createContext, useContext, useState, useEffect } from 'react';
import { generateProductId, generateOrderId, generateBillNumber } from '../utils/helpers';
import { printBarcode } from '../utils/barcodePrinter';

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
  const [lastPrintStatus, setLastPrintStatus] = useState(null);
  const [user, setUser] = useState(null); // { role: 'admin' | 'employee', username: string }

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedInventory = localStorage.getItem('erp_inventory');
      const savedOrders = localStorage.getItem('erp_orders');
      const savedSales = localStorage.getItem('erp_sales');
      const savedUser = localStorage.getItem('erp_user');

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
      if (savedUser) {
        setUser(JSON.parse(savedUser));
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
      inventoryQuantity: product.quantity || 0, // Initialize inventoryQuantity
      orderedQuantity: 0, // Initialize orderedQuantity
    };
    setInventory([...inventory, newProduct]);
    
    // Automatically print barcode after product is added with quantity
    // This is non-blocking - product is added even if printing fails
    printBarcode(newProduct.id, newProduct.name, newProduct.quantity)
      .then(() => {
        setLastPrintStatus({
          success: true,
          productId: newProduct.id,
          message: `${newProduct.quantity} barcode(s) printed successfully`,
        });
        // Clear status after 5 seconds
        setTimeout(() => setLastPrintStatus(null), 5000);
      })
      .catch((error) => {
        console.error('Failed to print barcode:', error);
        setLastPrintStatus({
          success: false,
          productId: newProduct.id,
          message: error.message || 'Failed to print barcode. Product was added successfully.',
        });
        // Clear status after 10 seconds for errors (longer so user can read it)
        setTimeout(() => setLastPrintStatus(null), 10000);
      });
    
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
    
    // If order is marked as paid, update ordered quantities
    if (updatedData.status === 'paid') {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        order.products.forEach(product => {
          setInventory(prevInventory =>
            prevInventory.map(item =>
              item.id === product.productId
                ? { 
                    ...item, 
                    orderedQuantity: (item.orderedQuantity || 0) + product.quantity 
                  }
                : item
            )
          );
        });
      }
    }
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  // Sales functions
  const completeOrder = (orderId, billNumber) => {
    const order = getOrderById(orderId);
    if (!order) return;

    // Mark order as paid (don't move to sales yet - employee needs to fulfill it)
    setOrders(orders.map(o => 
      o.id === orderId 
        ? { ...o, status: 'paid', billNumber, paidAt: new Date().toISOString() }
        : o
    ));
    
    return order;
  };
  
  // Move order to sales after employee completes it
  const fulfillOrder = (orderId) => {
    const order = getOrderById(orderId);
    if (!order) return;

    // Update inventory - deduct quantities
    order.products.forEach(product => {
      setInventory(prevInventory =>
        prevInventory.map(item =>
          item.id === product.productId
            ? { 
                ...item, 
                inventoryQuantity: Math.max(0, (item.inventoryQuantity || item.quantity || 0) - product.quantity),
                quantity: Math.max(0, (item.inventoryQuantity || item.quantity || 0) - product.quantity),
                orderedQuantity: Math.max(0, (item.orderedQuantity || 0) - product.quantity)
              }
            : item
        )
      );
    });

    // Move to sales
    const sale = {
      ...order,
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

  // Find product by EAN-13 barcode code (matches the barcode printed on labels)
  const findProductByBarcode = (barcodeValue) => {
    if (!barcodeValue || barcodeValue.trim() === '') {
      return null;
    }

    // Clean the scanned barcode (remove spaces, trim)
    const cleanBarcode = barcodeValue.trim().replace(/\s/g, '');
    
    console.log('Searching for barcode:', cleanBarcode);

    // Convert product ID to EAN-13 format (handles both old PROD-XXX and new numeric formats)
    const convertToEAN13Format = (productId) => {
      // If already 12-digit numeric, use as-is
      if (/^\d{12}$/.test(productId)) {
        return productId;
      }
      
      // Handle old PROD-XXX format - extract digits and pad
      const digits = productId.replace(/\D/g, '');
      if (digits.length === 0) {
        return '200000000000';
      }
      
      // If starts with 200 prefix, it's already in our format
      if (productId.startsWith('200') && digits.length >= 9) {
        return digits.padStart(12, '0').substring(0, 12);
      }
      
      // For old format, pad the extracted number
      return digits.padStart(12, '0').substring(0, 12);
    };

    // Calculate EAN-13 check digit
    const calculateCheckDigit = (code12) => {
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        const digit = parseInt(code12[i]);
        sum += digit * (i % 2 === 0 ? 1 : 3);
      }
      const remainder = sum % 10;
      return remainder === 0 ? '0' : String(10 - remainder);
    };

    // Strip check digit if 13-digit code was scanned (scanner reads all 13 digits)
    let scannedCode12;
    if (cleanBarcode.length === 13) {
      scannedCode12 = cleanBarcode.substring(0, 12);
    } else if (cleanBarcode.length === 12) {
      scannedCode12 = cleanBarcode;
    } else {
      // Try to match as-is if length is different
      scannedCode12 = cleanBarcode.padStart(12, '0').substring(0, 12);
    }

    console.log('Searching for 12-digit code:', scannedCode12);

    // Find matching product by comparing EAN-13 codes
    const foundProduct = inventory.find(product => {
      const productEAN13 = convertToEAN13Format(product.id);
      const match = productEAN13 === scannedCode12;
      
      console.log(`Comparing ${product.id}: ${productEAN13} === ${scannedCode12} ? ${match}`);
      
      return match;
    });

    if (foundProduct) {
      console.log('Found product:', foundProduct);
    } else {
      console.log('No product found for barcode:', scannedCode12);
    }

    return foundProduct;
  };

  // Deduct quantity when product is scanned
  const deductProductQuantity = (productId, quantity = 1) => {
    setInventory(prevInventory =>
      prevInventory.map(product => {
        if (product.id === productId) {
          const newInventoryQty = Math.max(0, (product.inventoryQuantity || product.quantity || 0) - quantity);
          const newOrderedQty = Math.max(0, (product.orderedQuantity || 0) - quantity);
          return { 
            ...product, 
            inventoryQuantity: newInventoryQty,
            orderedQuantity: newOrderedQty,
            quantity: newInventoryQty // Keep quantity synced for backward compatibility
          };
        }
        return product;
      })
    );
  };

  // Authentication functions
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('erp_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('erp_user');
  };

  const value = {
    inventory,
    orders,
    sales,
    user,
    addProduct,
    updateInventory,
    createOrder,
    updateOrder,
    getOrderById,
    completeOrder,
    fulfillOrder,
    getSalesByDesigner,
    getStats,
    generateBillNumber: () => generateBillNumber(sales),
    exportData,
    importData,
    clearAllData,
    lastPrintStatus,
    clearPrintStatus: () => setLastPrintStatus(null),
    findProductByBarcode,
    deductProductQuantity,
    login,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
