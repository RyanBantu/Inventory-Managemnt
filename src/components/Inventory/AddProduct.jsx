import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ProductForm from './ProductForm';
import { Check, AlertCircle, Printer } from 'lucide-react';
import { generateProductId } from '../../utils/helpers';

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct, inventory, lastPrintStatus, clearPrintStatus } = useApp();
  const [product, setProduct] = useState({
    name: '',
    quantity: 0,
    rate: 0,
    price: 0, // This is now the base price per unit
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Clear print status when component unmounts or user navigates away
  useEffect(() => {
    return () => {
      if (lastPrintStatus) {
        clearPrintStatus();
      }
    };
  }, [lastPrintStatus, clearPrintStatus]);

  const handleSubmit = () => {
    const newProduct = addProduct(product);
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/');
    }, 2000); // Increased timeout to allow print status to show
  };

  return (
    <div className="max-w-3xl mx-auto">
      {showSuccess && (
        <div
          className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3 text-green-700 shadow-sm"
        >
          <div className="p-2 bg-green-100 rounded-lg">
            <Check className="w-5 h-5" />
          </div>
          <span className="font-semibold">Product added successfully! Redirecting...</span>
        </div>
      )}
      
      {showSuccess && lastPrintStatus && (
        <div
          className={`mb-6 p-4 border-2 rounded-xl flex items-center gap-3 shadow-sm ${
            lastPrintStatus.success
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-yellow-50 border-yellow-200 text-yellow-700'
          }`}
        >
          <div className={`p-2 rounded-lg ${
            lastPrintStatus.success ? 'bg-blue-100' : 'bg-yellow-100'
          }`}>
            {lastPrintStatus.success ? (
              <Printer className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1">
            <span className="font-semibold">{lastPrintStatus.message}</span>
            {!lastPrintStatus.success && (
              <p className="text-sm mt-1 opacity-90">
                You can reprint the barcode later from the Products page.
              </p>
            )}
          </div>
          <button
            onClick={clearPrintStatus}
            className="text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}
      
      <ProductForm
        product={{
          ...product,
          id: generateProductId(inventory)
        }}
        onChange={setProduct}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AddProduct;
