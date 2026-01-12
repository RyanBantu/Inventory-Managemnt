import JsBarcode from 'jsbarcode';

/**
 * Converts product ID to EAN-13 compatible format (12 digits)
 * EAN-13 requires exactly 12 digits (13th is auto-calculated check digit)
 * @param {string} productId - The product ID to convert
 * @returns {string} - 12-digit numeric string for EAN-13
 */
export const convertToEAN13Format = (productId) => {
  // Extract all digits from product ID
  const digits = productId.replace(/\D/g, '');
  
  if (digits.length === 0) {
    // If no digits found, use a hash of the product ID
    let hash = 0;
    for (let i = 0; i < productId.length; i++) {
      hash = ((hash << 5) - hash) + productId.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    // Convert to positive number and ensure it's at least 6 digits to avoid too many leading zeros
    const numericId = Math.abs(hash).toString();
    // Pad to 12 digits, but ensure we don't have all zeros
    if (numericId === '0') {
      // Use a simple counter-based approach for zero hash
      return '200000000000'; // Use country code 2 (internal use) to avoid all zeros
    }
    return numericId.padStart(12, '0').substring(0, 12);
  }
  
  // If we have digits, pad or truncate to 12 digits
  if (digits.length >= 12) {
    return digits.substring(0, 12);
  }
  
  // For EAN-13, codes starting with 0 are VALID (country code 0 = USA/Canada or internal use)
  // We should preserve the original number structure
  // Simply pad with leading zeros to make 12 digits
  // This maintains the product ID relationship (e.g., PROD-008 -> 000000000008)
  return digits.padStart(12, '0');
};

/**
 * Generates a barcode image as SVG string using EAN-13 format
 * @param {string} productId - The product ID to encode in barcode
 * @returns {string} - SVG string of the barcode
 */
export const generateBarcodeImage = (productId) => {
  // Create SVG element with proper namespace
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  
  // Convert product ID to EAN-13 format (12 digits)
  const ean13Code = convertToEAN13Format(productId);
  
  try {
    // Generate EAN-13 barcode (jsbarcode auto-calculates check digit)
    // EAN-13 specifications per GS1 standard:
    // - Quiet zones: Minimum 11 modules on each side (approximately 11-15mm)
    // - Bar width: Minimum 0.33mm (we use width: 2.5 which is ~0.5mm at 203 DPI)
    // - Height: Minimum 15mm, recommended 20-25mm
    // - Contrast: Must be high (black on white)
    // EAN-13 GS1 Specifications:
    // - Quiet zones: Minimum 11 modules on each side
    //   At 203 DPI: 1 module = 0.33mm = ~2.6 dots, so 11 modules = ~29 dots = ~3.7mm
    //   We use margin: 30 pixels (approximately 3.7mm at 203 DPI) for safety
    // - Bar width: Minimum 0.33mm per module
    // - Height: Minimum 15mm, recommended 20-25mm
    // - Width parameter: Controls bar width (2.0 = ~0.4mm, safe for scanning)
    JsBarcode(svg, ean13Code, {
      format: 'EAN13',
      width: 2.0, // Bar width (2.0 = ~0.4mm per module, meets 0.33mm minimum)
      height: 80, // Height in pixels (~20mm at 203 DPI, exceeds 15mm minimum)
      displayValue: true, // Show human-readable numbers for verification
      fontSize: 12,
      textMargin: 2,
      margin: 30, // Quiet zone: 30 pixels = ~3.7mm (exceeds 11 module = ~3.6mm minimum)
      background: '#FFFFFF', // Pure white background
      lineColor: '#000000', // Pure black bars
      valid: function(valid) {
        if (!valid) {
          console.error('EAN-13 validation failed for:', ean13Code);
          throw new Error(`Invalid EAN-13 code: ${ean13Code}`);
        } else {
          console.log('EAN-13 code validated successfully:', ean13Code);
        }
      }
    });
    
    // Ensure SVG has proper attributes and dimensions
    if (!svg.getAttribute('xmlns')) {
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    
    // Set explicit dimensions for proper rendering
    // EAN-13 barcode is approximately 95 modules wide + quiet zones
    // At width=2.0: ~190 pixels for barcode + 60 pixels for quiet zones = ~250 pixels total
    // Height: 80 pixels for bars + ~20 pixels for text = ~100 pixels total
    // We need to add the SVG to DOM temporarily to get accurate dimensions
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
        // Add extra margin for quiet zones
        const totalWidth = bbox.width + 60; // 30px margin on each side
        const totalHeight = bbox.height + 20; // Extra space for text
        svg.setAttribute('width', totalWidth);
        svg.setAttribute('height', totalHeight);
        svg.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`);
        console.log('Barcode dimensions:', { width: totalWidth, height: totalHeight, bbox });
      } else {
        // Fallback: EAN-13 standard dimensions
        svg.setAttribute('width', '250');
        svg.setAttribute('height', '100');
        svg.setAttribute('viewBox', '0 0 250 100');
        console.warn('Using fallback dimensions');
      }
    } catch (bboxError) {
      // Fallback if getBBox fails
      console.warn('Could not get bounding box, using standard EAN-13 dimensions');
      svg.setAttribute('width', '250');
      svg.setAttribute('height', '100');
      svg.setAttribute('viewBox', '0 0 250 100');
    } finally {
      // Clean up temporary container
      document.body.removeChild(tempContainer);
    }
    
    // Verify barcode was actually generated
    if (!svg.children || svg.children.length === 0) {
      throw new Error('Barcode generation failed - no elements created in SVG');
    }
    
    // Verify the barcode data matches what we expect
    // Calculate check digit manually (function defined later in file)
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
 * Prints ONLY the barcode, nothing else to minimize paper waste
 * @param {string} productId - The product ID to print
 * @returns {string} - TSPL command string
 */
export const generateTSPLCommands = (productId) => {
  // Convert product ID to EAN-13 format (12 digits)
  const ean13Code = convertToEAN13Format(productId);
  
  // Label size - EAN-13 GS1 specifications:
  // - Barcode width: ~37.29mm (95 modules × 0.33mm + quiet zones)
  // - Quiet zones: Minimum 11 modules on each side = ~15mm recommended
  // - Total width needed: 37.29 + 15 + 15 = ~67mm minimum
  // - Height: Barcode ~20mm + margins = ~30mm
  const labelWidth = 70; // mm (exceeds minimum for proper quiet zones)
  const labelHeight = 35; // mm (allows for proper barcode height)
  const dpi = 203; // TSC TE 244 default DPI
  
  // Convert mm to dots (1 inch = 25.4mm, so 1mm = dpi/25.4 dots)
  const mmToDots = (mm) => Math.round((mm * dpi) / 25.4);
  
  // TSPL commands - minimal setup
  let commands = '';
  
  // Initialize printer with minimal settings
  // CLS clears the image buffer (important before printing)
  commands += 'CLS\n';
  commands += 'SIZE ' + labelWidth + ' mm, ' + labelHeight + ' mm\n';
  commands += 'GAP 2 mm, 0 mm\n'; // Small gap between labels
  commands += 'DIRECTION 1\n'; // Print direction (1 = forward)
  commands += 'REFERENCE 0,0\n'; // Reference point (top-left corner)
  commands += 'OFFSET 0 mm\n'; // No print offset
  commands += 'SET TEAR ON\n'; // Tear-off mode (for continuous labels)
  commands += 'SET PEEL OFF\n'; // Disable peel-off mode
  commands += 'SET CUTTER OFF\n'; // Disable cutter
  
  // Print ONLY the EAN-13 barcode with proper quiet zones per GS1 standard
  // TSPL BARCODE command format: BARCODE x,y,"type",height,readable,rotation,narrow,wide,"data"
  // For TSC printers, EAN-13 uses "EAN" format name
  // Position in dots (not mm)
  // EAN-13 barcode specifications:
  // - Width: ~37.29mm = ~295 dots at 203 DPI
  // - Quiet zone: Minimum 11 modules = ~15mm = ~120 dots (we use 15mm for safety)
  // - Height: Minimum 15mm, recommended 20-25mm = ~160-200 dots
  const labelWidthDots = mmToDots(labelWidth);
  const barcodeWidthDots = mmToDots(37.29); // EAN-13 standard width
  const quietZoneDots = mmToDots(15); // 15mm quiet zone on each side (exceeds minimum)
  const barcodeX = quietZoneDots; // Start after quiet zone (left margin)
  const barcodeY = mmToDots(5); // 5mm from top
  const barcodeHeight = mmToDots(25); // 25mm height (exceeds minimum, better scanning)
  
  // Print barcode with proper GS1-compliant dimensions
  // TSC TSPL EAN-13 format: BARCODE x,y,"EAN",height,readable,rotation,narrow,wide,"12-digit-code"
  // narrow and wide: For EAN-13, bar width ratio should be 2:1 (narrow=2, wide=4)
  // readable: 0 = no text, 1 = show human-readable numbers below barcode
  // rotation: 0 = normal orientation
  // The printer automatically calculates the 13th check digit
  
  // Validate EAN-13 code before printing
  if (!/^\d{12}$/.test(ean13Code)) {
    throw new Error(`Invalid EAN-13 code format: ${ean13Code}. Must be exactly 12 digits.`);
  }
  
  // EAN-13 codes starting with 0 are valid (e.g., "000000000007")
  // TSC printers use "EAN" format for EAN-13 barcodes
  // Format: BARCODE x,y,"EAN",height,readable,rotation,narrow,wide,"data"
  // Note: readable=1 shows numbers, but we set to 0 to save space (barcode only)
  commands += `BARCODE ${barcodeX},${barcodeY},"EAN",${barcodeHeight},0,0,2,4,"${ean13Code}"\n`;
  
  // Debug: Log the exact command being sent
  console.log('TSPL BARCODE command:', `BARCODE ${barcodeX},${barcodeY},"EAN",${barcodeHeight},0,0,2,4,"${ean13Code}"`);
  
  // Print only 1 copy
  // Format: PRINT quantity,sets
  commands += 'PRINT 1,1\n';
  
  // Add final newline to ensure command is complete
  commands += '\n';
  
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
 * @returns {Promise<void>}
 */
const printViaWebUSB = async (productId) => {
  let device = null;
  try {
    device = await connectToPrinter();
    const commands = generateTSPLCommands(productId);
    
    // Debug: Log the TSPL commands being sent
    console.log('TSPL Commands to send:', commands);
    console.log('Command length:', commands.length);
    
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
 * Prints ONLY the barcode, nothing else
 * @param {string} productId - Product ID to print
 */
const printViaBrowser = (productId) => {
  // Create a printable HTML page with ONLY the barcode
  const barcodeSvg = generateBarcodeImage(productId);
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Barcode - ${productId}</title>
        <style>
          @media print {
            @page {
              size: 70mm 35mm;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
          }
          body {
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 70mm;
            height: 35mm;
            overflow: hidden;
            background: white;
          }
          .barcode-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            padding: 10mm; /* Quiet zone margin per GS1 standard (minimum 11 modules) */
            box-sizing: border-box;
          }
          svg {
            max-width: 100%;
            max-height: 100%;
            display: block;
          }
        </style>
      </head>
      <body>
        <div class="barcode-container">${barcodeSvg}</div>
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
 * Prints ONLY the EAN-13 barcode, nothing else
 * 
 * IMPORTANT: Scanner Configuration Required
 * Based on LS-450A manual, you MUST:
 * 1. Scan "Enable EAN-13" barcode from the manual to enable EAN-13 support
 * 2. If using USB-COM or RS232, configure baud rate (9600, 19200, 38400, 57600, or 115200)
 * 3. Default interface is USB-HID (keyboard emulation) - NO baud rate needed for this mode
 * 4. Ensure scanner is in proper scan mode (Manual, Continuous, or Auto)
 * 5. Check "Image Inverted" setting if barcodes still don't scan
 * 
 * @param {string} productId - Product ID to print
 * @param {string} productName - Optional (not used, kept for compatibility)
 * @returns {Promise<void>}
 */
export const printBarcode = async (productId, productName = '') => {
  if (!productId) {
    throw new Error('Product ID is required for barcode printing');
  }
  
  // Convert and validate EAN-13 code
  const ean13Code = convertToEAN13Format(productId);
  
  // Validate EAN-13 format (must be exactly 12 digits)
  if (!/^\d{12}$/.test(ean13Code)) {
    throw new Error(`Invalid EAN-13 format: ${ean13Code}. Must be exactly 12 digits.`);
  }
  
  // Log the EAN-13 code for debugging
  console.log('Printing EAN-13 barcode:', {
    productId,
    ean13Code,
    fullEAN13: `${ean13Code}${calculateEAN13CheckDigit(ean13Code)}`, // Show full 13-digit code
    note: 'Ensure scanner has EAN-13 enabled by scanning "Enable EAN-13" from manual'
  });
  
  // Check if WebUSB is available
  if (navigator.usb && navigator.usb.requestDevice) {
    try {
      await printViaWebUSB(productId);
      return;
    } catch (error) {
      console.warn('WebUSB printing failed, falling back to browser print:', error);
      // Fall through to browser print fallback
    }
  }
  
  // Fallback to browser print dialog
  printViaBrowser(productId);
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
    // Odd positions (1-indexed) are multiplied by 1, even by 3
    sum += digit * (i % 2 === 0 ? 1 : 3);
  }
  
  const remainder = sum % 10;
  return remainder === 0 ? '0' : String(10 - remainder);
};

