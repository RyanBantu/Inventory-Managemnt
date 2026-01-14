import JsBarcode from 'jsbarcode';

/**
 * Converts product ID to EAN-13 compatible format (12 digits)
 * EAN-13 requires exactly 12 digits (13th is auto-calculated check digit)
 * @param {string} productId - The product ID to convert
 * @returns {string} - 12-digit numeric string for EAN-13
 */
export const convertToEAN13Format = (productId) => {
  // If already 12-digit numeric, use as-is (new format)
  if (/^\d{12}$/.test(productId)) {
    return productId;
  }
  
  // Extract all digits from product ID
  const digits = productId.replace(/\D/g, '');
  
  if (digits.length === 0) {
    // Default fallback
    return '200000000000';
  }
  
  if (digits.length >= 12) {
    return digits.substring(0, 12);
  }
  
  return digits.padStart(12, '0');
};

/**
 * Generates a barcode image as SVG string using EAN-13 format
 * @param {string} productId - The product ID to encode in barcode
 * @returns {string} - SVG string of the barcode
 */
export const generateBarcodeImage = (productId) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const ean13Code = convertToEAN13Format(productId);
  
  try {
    JsBarcode(svg, ean13Code, {
      format: 'EAN13',
      width: 3,
      height: 100,
      displayValue: true,
      fontSize: 20,
      textMargin: 8,
      margin: 10,
      background: '#FFFFFF',
      lineColor: '#000000',
      valid: function(valid) {
        if (!valid) {
          console.error('EAN-13 validation failed for:', ean13Code);
          throw new Error(`Invalid EAN-13 code: ${ean13Code}`);
        } else {
          console.log('EAN-13 code validated successfully:', ean13Code);
        }
      }
    });
    
    if (!svg.getAttribute('xmlns')) {
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.visibility = 'hidden';
    tempContainer.style.width = '0';
    tempContainer.style.height = '0';
    tempContainer.appendChild(svg);
    document.body.appendChild(tempContainer);
    
    try {
      const bbox = svg.getBBox();
      if (bbox.width > 0 && bbox.height > 0) {
        const totalWidth = bbox.width + 20;
        const totalHeight = bbox.height + 20;
        svg.setAttribute('width', totalWidth);
        svg.setAttribute('height', totalHeight);
        svg.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`);
        console.log('Barcode dimensions:', { width: totalWidth, height: totalHeight, bbox });
      } else {
        svg.setAttribute('width', '300');
        svg.setAttribute('height', '150');
        svg.setAttribute('viewBox', '0 0 300 150');
        console.warn('Using fallback dimensions');
      }
    } catch (bboxError) {
      console.warn('Could not get bounding box, using standard EAN-13 dimensions');
      svg.setAttribute('width', '300');
      svg.setAttribute('height', '150');
      svg.setAttribute('viewBox', '0 0 300 150');
    } finally {
      document.body.removeChild(tempContainer);
    }
    
    if (!svg.children || svg.children.length === 0) {
      throw new Error('Barcode generation failed - no elements created in SVG');
    }
    
    let checkDigit = '?';
    try {
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        const digit = parseInt(ean13Code[i]);
        sum += digit * (i % 2 === 0 ? 1 : 3);
      }
      const remainder = sum % 10;
      checkDigit = remainder === 0 ? '0' : String(10 - remainder);
    } catch (e) {
      console.warn('Could not calculate check digit');
    }
    const fullEAN13 = ean13Code + checkDigit;
    
    console.log('Barcode generated successfully:', {
      productId,
      ean13Code,
      fullEAN13: fullEAN13,
      expectedScanResult: fullEAN13,
      svgChildren: svg.children.length,
      svgWidth: svg.getAttribute('width'),
      svgHeight: svg.getAttribute('height'),
      note: 'Scanner should read: ' + fullEAN13
    });
    
    return svg.outerHTML;
  } catch (error) {
    console.error('Error generating barcode:', error);
    throw error;
  }
};

/**
 * Generates TSPL (TSC Printer Language) commands for TSC TE 244 printer
 * @param {string} productId - The product ID to print
 * @param {number} quantity - Number of barcodes to print (default: 1)
 * @param {number} barcodesPerRow - Number of barcodes per row (default: 2)
 * @returns {string} - TSPL command string
 */
export const generateTSPLCommands = (productId, quantity = 1, barcodesPerRow = 2) => {
  const ean13Code = convertToEAN13Format(productId);
  
  // TSC TE 244 specifications: 203 DPI, 4-inch width (108mm max print width)
  // At 203 DPI: 1mm = 8 dots
  const dpi = 203;
  const mmToDots = (mm) => Math.round((mm * dpi) / 25.4);
  
  // EAN-13 barcode sizing for good scannability
  // Standard EAN-13 at 100% = 37.29mm wide x 25.93mm tall
  // Using 150% magnification for clear, scannable barcode
  const magnification = 1.5;
  const barcodeWidthMM = 37.29 * magnification; // ~56mm
  const barcodeHeightMM = 25.93 * magnification; // ~39mm
  
  // Label size - optimized for barcode
  const labelWidthMM = 70; // 70mm wide label
  const labelHeightMM = 50; // 50mm tall label
  
  // Bar widths in dots
  // For 150% magnification at 203 DPI:
  // X-dimension (narrow bar) = 0.33mm * 1.5 = 0.495mm ≈ 4 dots
  // Wide bar should be 2-3x narrow bar
  const narrowWidth = 4; // 4 dots = ~0.5mm (proper for 150% magnification)
  const wideWidth = 10;  // 10 dots = ~1.2mm (2.5x narrow bar)
  
  // Barcode height in dots
  const barcodeHeightDots = mmToDots(barcodeHeightMM);
  
  // Position barcode centered with proper quiet zones
  const quietZoneLeft = mmToDots(7); // Left quiet zone ~7mm
  const barcodeX = quietZoneLeft;
  const barcodeY = mmToDots(5); // 5mm from top
  
  // Validate EAN-13 code
  if (!/^\d{12}$/.test(ean13Code)) {
    throw new Error(`Invalid EAN-13 code: ${ean13Code}. Must be exactly 12 digits.`);
  }
  
  // Build TSPL commands
  let commands = '';
  commands += 'CLS\n';
  commands += `SIZE ${labelWidthMM} mm, ${labelHeightMM} mm\n`;
  commands += 'GAP 2 mm, 0 mm\n';
  commands += 'DIRECTION 1\n';
  commands += 'REFERENCE 0,0\n';
  commands += 'OFFSET 0 mm\n';
  commands += 'SET TEAR ON\n';
  commands += 'SET PEEL OFF\n';
  commands += 'SET CUTTER OFF\n';
  commands += 'DENSITY 10\n'; // Print darkness (0-15, 10 is good balance)
  commands += 'SPEED 2\n'; // Print speed (1-6, 2 is slow for quality)
  
  // Calculate number of barcodes per label (max 2 per row)
  const spacing = mmToDots(5); // 5mm spacing between barcodes
  const barcodesPerLabel = Math.min(barcodesPerRow, 2);
  
  // Generate multiple labels if quantity > barcodesPerLabel
  const totalLabels = Math.ceil(quantity / barcodesPerLabel);
  
  // For each label
  for (let labelNum = 0; labelNum < totalLabels; labelNum++) {
    const barcodesOnThisLabel = Math.min(barcodesPerLabel, quantity - (labelNum * barcodesPerLabel));
    
    for (let i = 0; i < barcodesOnThisLabel; i++) {
      const xPos = barcodeX + (i * (mmToDots(barcodeWidthMM) + spacing));
      // BARCODE command: x, y, "type", height, human_readable, rotation, narrow, wide, "data"
      commands += `BARCODE ${xPos},${barcodeY},"EAN13",${barcodeHeightDots},1,0,${narrowWidth},${wideWidth},"${ean13Code}"\n`;
    }
  }
  
  commands += `PRINT 1,${totalLabels}\n`;
  
  console.log('=== EAN-13 Barcode Print Configuration ===');
  console.log('Product ID:', productId);
  console.log('EAN-13 Code (12 digits):', ean13Code);
  console.log('Label Size:', `${labelWidthMM}mm × ${labelHeightMM}mm`);
  console.log('Barcode Size:', `${barcodeWidthMM.toFixed(1)}mm × ${barcodeHeightMM.toFixed(1)}mm (${magnification * 100}% magnification)`);
  console.log('Bar Widths:', `narrow=${narrowWidth} dots, wide=${wideWidth} dots`);
  console.log('Barcode Height:', `${barcodeHeightDots} dots`);
  console.log('Position:', `x=${barcodeX} dots, y=${barcodeY} dots`);
  console.log('TSPL Command:', `BARCODE ${barcodeX},${barcodeY},"EAN13",${barcodeHeightDots},1,0,${narrowWidth},${wideWidth},"${ean13Code}"`);
  console.log('=========================================');
  
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
    const filters = [
      { vendorId: 0x04b8 },
      { vendorId: 0x0483 },
    ];
    
    const device = await navigator.usb.requestDevice({ filters });
    
    if (!device) {
      throw new Error('No printer device selected');
    }
    
    await device.open();
    
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
 * @param {number} quantity - Number of copies to print
 */
const sendToPrinter = async (device, commands, quantity = 1) => {
  try {
    const data = stringToUint8Array(commands);
    await device.transferOut(1, data);
  } catch (error) {
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
 * @param {number} quantity - Number of barcodes to print
 * @returns {Promise<void>}
 */
const printViaWebUSB = async (productId, quantity = 1) => {
  let device = null;
  try {
    device = await connectToPrinter();
    const commands = generateTSPLCommands(productId, quantity);
    
    console.log('TSPL Commands to send:', commands);
    console.log('Command length:', commands.length);
    console.log('Printing quantity:', quantity);
    
    await sendToPrinter(device, commands, quantity);
    
    try {
      await device.releaseInterface(0);
    } catch (e) {
      try {
        await device.releaseInterface(1);
      } catch (e2) {
        // Ignore
      }
    }
    
    await device.close();
  } catch (error) {
    if (device) {
      try {
        await device.close();
      } catch (e) {
        // Ignore
      }
    }
    throw error;
  }
};

/**
 * Prints barcode using browser print dialog (fallback method)
 * Optimized for 150mm × 100mm label rolls (15cm × 10cm)
 * Fits 3 barcodes per sheet
 * @param {string} productId - Product ID to print
 * @param {string} productName - Product name to display
 * @param {number} quantity - Number of barcodes to print
 */
const printViaBrowser = (productId, productName = '', quantity = 1) => {
  const ean13Code = convertToEAN13Format(productId);
  
  // Label dimensions: 150mm (width) × 100mm (height)
  const labelWidth = 150;
  
  // Calculate how many sheets needed (6 barcodes per sheet)
  const barcodesPerSheet = 6;
  const sheetsNeeded = Math.ceil(quantity / barcodesPerSheet);
  
  console.log(`Generating ${quantity} labels across ${sheetsNeeded} sheet(s) for product ${productId}`);
  
  let sheetsHtml = '';
  
  for (let sheet = 0; sheet < sheetsNeeded; sheet++) {
    const barcodesOnThisSheet = Math.min(barcodesPerSheet, quantity - (sheet * barcodesPerSheet));
    
    let barcodeItemsHtml = '';
    for (let i = 0; i < barcodesOnThisSheet; i++) {
      // Generate fresh SVG for each barcode
      const barcodeSvg = generateBarcodeImage(productId);
      
      barcodeItemsHtml += `
        <div class="barcode-item">
          <div class="barcode-container">${barcodeSvg}</div>
        </div>
      `;
    }
    
    sheetsHtml += `
      <div class="label-page">
        ${barcodeItemsHtml}
      </div>
    `;
    
    console.log(`Generated sheet ${sheet + 1} with ${barcodesOnThisSheet} barcode(s)`);
  }
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Barcodes - ${productId}</title>
        <style>
          @media print {
            @page {
              size: ${labelWidth}mm auto;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .no-print {
              display: none;
            }
          }
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background: white;
          }
          .label-page {
            width: ${labelWidth}mm;
            display: flex;
            flex-direction: column;
            gap: 0mm;
            background: white;
            padding: 1mm 2mm;
            margin: 0 auto 10mm auto;
            page-break-after: always;
          }
          .barcode-item {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1mm;
          }
          .barcode-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
          }
          .barcode-container svg {
            width: 144mm !important;
            height: 32mm !important;
            max-height: none !important;
          }
          .print-info {
            margin: 10mm;
            padding: 5mm;
            background: #f0f0f0;
          .print-info {
            margin: 10mm;
            padding: 5mm;
            background: #f0f0f0;
            border-radius: 4px;
            font-size: 12px;
            color: #333;
            border: 1px solid #ddd;
          }
          @media print {
            .print-info {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-info no-print">
          <strong>Ready to print ${quantity} barcode(s) on ${sheetsNeeded} sheet(s)</strong><br>
          Product: ${productName || productId} | EAN-13: ${ean13Code}<br>
          Label Size: ${labelWidth}mm × auto (6 barcodes per sheet)
        </div>
        ${sheetsHtml}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            }, 500);
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
 * @param {number} quantity - Number of barcodes to print (default: 1)
 * @returns {Promise<void>}
 */
export const printBarcode = async (productId, productName = '', quantity = 1) => {
  if (!productId) {
    throw new Error('Product ID is required for barcode printing');
  }
  
  const ean13Code = convertToEAN13Format(productId);
  
  if (!/^\d{12}$/.test(ean13Code)) {
    throw new Error(`Invalid EAN-13 format: ${ean13Code}. Must be exactly 12 digits.`);
  }
  
  console.log('Printing EAN-13 barcode:', {
    productId,
    ean13Code,
    fullEAN13: `${ean13Code}${calculateEAN13CheckDigit(ean13Code)}`,
    quantity,
    note: 'Ensure scanner has EAN-13 enabled'
  });
  
  if (navigator.usb && navigator.usb.requestDevice) {
    try {
      await printViaWebUSB(productId, quantity);
      return;
    } catch (error) {
      console.warn('WebUSB printing failed, falling back to browser print:', error);
    }
  }
  
  printViaBrowser(productId, productName, quantity);
};

/**
 * Calculates EAN-13 check digit (13th digit)
 * @param {string} code - 12-digit code
 * @returns {string} - Check digit (0-9)
 */
const calculateEAN13CheckDigit = (code) => {
  if (!/^\d{12}$/.test(code)) {
    return '?';
  }
  
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(code[i]);
    sum += digit * (i % 2 === 0 ? 1 : 3);
  }
  
  const remainder = sum % 10;
  return remainder === 0 ? '0' : String(10 - remainder);
};
