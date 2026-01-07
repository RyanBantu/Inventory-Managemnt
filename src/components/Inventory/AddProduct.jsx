import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ProductForm from './ProductForm';
import { Check } from 'lucide-react';
import { generateProductId } from '../../utils/helpers';

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct, inventory } = useApp();
  const [product, setProduct] = useState({
    name: '',
    quantity: 0,
    rate: 0,
    price: 0, // This is now the base price per unit
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    const newProduct = addProduct(product);
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/');
    }, 1500);
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
