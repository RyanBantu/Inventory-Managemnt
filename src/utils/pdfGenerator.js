import jsPDF from 'jspdf';

export const generateBillPDF = (order, billNumber) => {
  const doc = new jsPDF();
  
  // Colors
  const primaryColor = [59, 130, 246]; // Light blue
  const textColor = [30, 41, 59]; // Dark gray
  
  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 20, 25);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Bill No: ${billNumber}`, 150, 20);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 28);
  
  // Reset text color
  doc.setTextColor(...textColor);
  
  // Company/Client Info
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 20, 55);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Client: ${order.clientName}`, 20, 62);
  doc.text(`Designer: ${order.designerName}`, 20, 68);
  
  // Line
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, 75, 190, 75);
  
  // Table Header
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(219, 234, 254); // Light blue background
  doc.rect(20, 80, 170, 8, 'F');
  
  doc.text('Product', 25, 85);
  doc.text('Quantity', 100, 85);
  doc.text('Unit Price', 130, 85);
  doc.text('Total', 170, 85);
  
  // Table Content
  doc.setFont('helvetica', 'normal');
  let yPos = 95;
  
  order.products.forEach((product, index) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    const bgColor = index % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
    doc.setFillColor(...bgColor);
    doc.rect(20, yPos - 5, 170, 8, 'F');
    
    doc.text(product.name, 25, yPos);
    doc.text(product.quantity.toString(), 100, yPos);
    doc.text(`$${product.price.toFixed(2)}`, 130, yPos);
    doc.text(`$${(product.price * product.quantity).toFixed(2)}`, 170, yPos);
    
    yPos += 10;
  });
  
  // Totals
  const subtotal = order.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;
  
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', 130, yPos);
  doc.text(`$${subtotal.toFixed(2)}`, 170, yPos);
  
  yPos += 8;
  doc.text('Tax (10%):', 130, yPos);
  doc.text(`$${tax.toFixed(2)}`, 170, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setFillColor(...primaryColor);
  doc.rect(120, yPos - 5, 70, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Total:', 130, yPos + 3);
  doc.text(`$${total.toFixed(2)}`, 170, yPos + 3);
  
  // Footer
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Thank you for your business!', 20, 280);
  
  // Save PDF
  doc.save(`Bill-${billNumber}.pdf`);
  
  return true;
};
