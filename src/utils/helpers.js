// Helper functions for ID generation and calculations

export const generateProductId = (inventory) => {
  if (!inventory || inventory.length === 0) {
    return 'PROD-001';
  }
  
  const ids = inventory
    .map(item => item.id)
    .filter(id => id.startsWith('PROD-'))
    .map(id => parseInt(id.split('-')[1]))
    .filter(num => !isNaN(num));
  
  if (ids.length === 0) {
    return 'PROD-001';
  }
  
  const maxId = Math.max(...ids);
  const nextId = maxId + 1;
  return `PROD-${String(nextId).padStart(3, '0')}`;
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
