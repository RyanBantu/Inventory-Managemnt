// Helper functions for ID generation and calculations

// EAN-13 compatible product ID generation
// Uses 12-digit numeric IDs starting with 200 (internal use prefix)
// Format: 200XXXXXXXXX where X is sequential number
export const generateProductId = (inventory) => {
  const prefix = '200'; // Internal use prefix for EAN-13
  
  if (!inventory || inventory.length === 0) {
    return `${prefix}000000001`; // 200000000001 (12 digits)
  }
  
  // Extract numeric IDs, handling both old PROD-XXX and new numeric formats
  const ids = inventory
    .map(item => {
      if (typeof item.id === 'string') {
        // Handle old PROD-XXX format
        if (item.id.startsWith('PROD-')) {
          return parseInt(item.id.split('-')[1]) || 0;
        }
        // Handle new numeric format (200XXXXXXXXX)
        if (item.id.startsWith('200') && item.id.length === 12) {
          return parseInt(item.id.substring(3)) || 0;
        }
        // Try parsing as pure number
        return parseInt(item.id) || 0;
      }
      return 0;
    })
    .filter(num => !isNaN(num) && num > 0);
  
  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  const nextId = maxId + 1;
  
  // Pad to 9 digits after prefix (total 12 digits for EAN-13)
  return `${prefix}${String(nextId).padStart(9, '0')}`;
};

export const generateOrderId = (orders) => {
  if (!orders || orders.length === 0) {
    return 'ORD-001';
  }
  
  const ids = orders
    .map(order => order.id)
    .filter(id => id.startsWith('ORD-'))
    .map(id => parseInt(id.split('-')[1]))
    .filter(num => !isNaN(num));
  
  if (ids.length === 0) {
    return 'ORD-001';
  }
  
  const maxId = Math.max(...ids);
  const nextId = maxId + 1;
  return `ORD-${String(nextId).padStart(3, '0')}`;
};

export const generateBillNumber = (sales) => {
  if (!sales || sales.length === 0) {
    return 'BILL-001';
  }
  
  const billNumbers = sales
    .map(sale => sale.billNumber)
    .filter(bill => bill && bill.startsWith('BILL-'))
    .map(bill => parseInt(bill.split('-')[1]))
    .filter(num => !isNaN(num));
  
  if (billNumbers.length === 0) {
    return 'BILL-001';
  }
  
  const maxBill = Math.max(...billNumbers);
  const nextBill = maxBill + 1;
  return `BILL-${String(nextBill).padStart(3, '0')}`;
};

export const calculateTotal = (products) => {
  return products.reduce((sum, product) => {
    return sum + (product.price * product.quantity);
  }, 0);
};

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

export const getWeekStartDate = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day;
  return new Date(today.setDate(diff)).toISOString().split('T')[0];
};
