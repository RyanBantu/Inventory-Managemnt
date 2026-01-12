import JsBarcode from 'jsbarcode';

/**
 * Detects the best barcode format for a given product ID
 * @param {string} productId - The product ID to encode
 * @returns {string} - Barcode format name
 */
export const detectBarcodeFormat = (productId) => {
  // Code 128 supports alphanumeric and is most common
  // It works well with formats like "PROD-001"
  if (/^[A-Z0-9\-]+$/i.test(productId)) {
    return 'CODE128';
  }
  // Fallback to Code 39 for other formats
  return 'CODE39';
};

/**
 * Generates a barcode image as SVG string
 * @param {string} productId - The product ID to encode in barcode
 * @returns {string} - SVG string of the barcode
 */
export const generateBarcodeImage = (productId) => {
  // Create SVG element with proper namespace
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const format = detectBarcodeFormat(productId);
  
  try {
    // Generate barcode into the SVG element
    JsBarcode(svg, productId, {
      format: format,
      width: 2,
      height: 80,
      displayValue: true,
      fontSize: 14,
      textMargin: 5,
      margin: 10,
      background: 'transparent',
    });
    
    // Ensure SVG has proper attributes
    if (!svg.getAttribute('xmlns')) {
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    
    return svg.outerHTML;
  } catch (error) {
    console.error('Error generating barcode:', error);
    throw error;
  }
};

/**
 * Generates TSPL (TSC Printer Language) commands for TSC TE 244 printer
 * @param {string} productId - The product ID to print
 * @param {string} productName - Optional product name
 * @returns {string} - TSPL command string
 */
export const generateTSPLCommands = (productId, productName = '') => {
  // TSC TE 244 supports labels up to 104mm wide
  // Standard label size: 50mm x 30mm (or adjust as needed)
  const labelWidth = 50; // mm
  const labelHeight = 30; // mm
  const dpi = 203; // TSC TE 244 default DPI
  
  // Convert mm to dots (1 inch = 25.4mm, so 1mm = dpi/25.4 dots)
  const widthDots = Math.round((labelWidth * dpi) / 25.4);
  const heightDots = Math.round((labelHeight * dpi) / 25.4);
  
  // TSPL commands
  let commands = '';
  
  // Initialize printer
  commands += 'SIZE ' + labelWidth + ' mm, ' + labelHeight + ' mm\n';
  commands += 'GAP 3 mm, 0 mm\n'; // Gap between labels
  commands += 'DIRECTION 1\n'; // Print direction
  commands += 'REFERENCE 0,0\n'; // Reference point
  commands += 'OFFSET 0 mm\n'; // Print offset
  commands += 'SET PEEL OFF\n'; // Peel-off mode (adjust if needed)
  commands += 'SET CUTTER OFF\n'; // Cutter mode (adjust if needed)
  commands += 'SET PARTIAL_CUTTER OFF\n';
  commands += 'SET TEAR ON\n'; // Tear-off mode
  commands += 'CLEAR\n'; // Clear buffer
  
  // Print product name (if provided and space allows)
  if (productName && productName.length > 0) {
    const maxNameLength = 20; // Adjust based on label size
    const truncatedName = productName.length > maxNameLength 
      ? productName.substring(0, maxNameLength) 
      : productName;
    
    commands += `TEXT 10,10,"3",0,1,1,"${truncatedName}"\n`;
  }
  
  // Print barcode (Code 128)
  // Position: x=10, y=50 (adjust based on label layout)
  // Format: Code 128, height=60, readable=1 (human readable)
  const barcodeY = productName ? 50 : 30;
  commands += `BARCODE ${10},${barcodeY},"128",60,1,0,2,2,"${productId}"\n`;
  
  // Print product ID text below barcode
  const textY = barcodeY + 80; // Below barcode
  commands += `TEXT 10,${textY},"3",0,1,1,"${productId}"\n`;
  
  // Print the label
  commands += 'PRINT 1,1\n'; // Print 1 copy, 1 set
  
  return commands;
};

/**
 * Converts string to Uint8Array for USB transfer
 * @param {string} str - String to convert
 * @returns {Uint8Array} - Byte array
 */
const stringToUint8Array = (str) => {
  const encoder = new TextEncoder();
  return encoder.encode(str);
};

/**
 * Connects to TSC printer via WebUSB
 * @returns {Promise<USBDevice>} - Connected USB device
 */
const connectToPrinter = async () => {
  try {
    // TSC printer USB vendor/product IDs (common values)
    // Note: These may need adjustment based on actual device
    const filters = [
      { vendorId: 0x04b8 }, // TSC vendor ID
      { vendorId: 0x0483 }, // Alternative vendor ID
    ];
    
    const device = await navigator.usb.requestDevice({ filters });
    
    if (!device) {
      throw new Error('No printer device selected');
    }
    
    await device.open();
    
    // Try to claim interface (usually interface 0 or 1)
    try {
      await device.claimInterface(0);
    } catch (e) {
      try {
        await device.claimInterface(1);
      } catch (e2) {
        console.warn('Could not claim interface, trying without claiming');
      }
    }
    
    return device;
  } catch (error) {
    if (error.name === 'NotFoundError') {
      throw new Error('Printer not found. Please make sure it is connected and try again.');
    }
    throw error;
  }
};

/**
 * Sends TSPL commands to printer via WebUSB
 * @param {USBDevice} device - Connected USB device
 * @param {string} commands - TSPL command string
 */
const sendToPrinter = async (device, commands) => {
  try {
    const data = stringToUint8Array(commands);
    
    // Send data to endpoint (usually endpoint 1 for bulk out)
    await device.transferOut(1, data);
  } catch (error) {
    // Try alternative endpoint
    try {
      const data = stringToUint8Array(commands);
      await device.transferOut(2, data);
    } catch (e) {
      throw new Error('Failed to send data to printer: ' + error.message);
    }
  }
};

/**
 * Prints barcode using WebUSB API (primary method)
 * @param {string} productId - Product ID to print
 * @param {string} productName - Optional product name
 * @returns {Promise<void>}
 */
const printViaWebUSB = async (productId, productName) => {
  let device = null;
  try {
    device = await connectToPrinter();
    const commands = generateTSPLCommands(productId, productName);
    await sendToPrinter(device, commands);
    
    // Release interface
    try {
      await device.releaseInterface(0);
    } catch (e) {
      try {
        await device.releaseInterface(1);
      } catch (e2) {
        // Ignore if interface wasn't claimed
      }
    }
    
    await device.close();
  } catch (error) {
    if (device) {
      try {
        await device.close();
      } catch (e) {
        // Ignore close errors
      }
    }
    throw error;
  }
};

/**
 * Prints barcode using browser print dialog (fallback method)
 * @param {string} productId - Product ID to print
 * @param {string} productName - Optional product name
 */
const printViaBrowser = (productId, productName) => {
  // Create a printable HTML page with the barcode
  const barcodeSvg = generateBarcodeImage(productId);
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Barcode Label - ${productId}</title>
        <style>
          @media print {
            @page {
              size: 50mm 30mm;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 5mm;
              font-family: Arial, sans-serif;
            }
          }
          body {
            margin: 0;
            padding: 5mm;
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 50mm;
            height: 30mm;
          }
          .product-name {
            font-size: 10px;
            margin-bottom: 2mm;
            text-align: center;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .barcode-container {
            margin: 2mm 0;
          }
          .product-id {
            font-size: 12px;
            margin-top: 2mm;
            text-align: center;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        ${productName ? `<div class="product-name">${productName}</div>` : ''}
        <div class="barcode-container">${barcodeSvg}</div>
        <div class="product-id">${productId}</div>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

/**
 * Main function to print barcode label
 * @param {string} productId - Product ID to print
 * @param {string} productName - Optional product name
 * @returns {Promise<void>}
 */
export const printBarcode = async (productId, productName = '') => {
  if (!productId) {
    throw new Error('Product ID is required for barcode printing');
  }
  
  // Check if WebUSB is available
  if (navigator.usb && navigator.usb.requestDevice) {
    try {
      await printViaWebUSB(productId, productName);
      return;
    } catch (error) {
      console.warn('WebUSB printing failed, falling back to browser print:', error);
      // Fall through to browser print fallback
    }
  }
  
  // Fallback to browser print dialog
  printViaBrowser(productId, productName);
};

