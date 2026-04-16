import React from 'react';
import ProductCard from '../components/ProductCard'; // Make sure this path is correct
import { plumbingProducts } from '../plumbingData'; // Make sure this path is correct

const PlumbingCatalog: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Inventory</h2>
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Plumbing Products
        </p>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
          High-quality 1-inch CPVC pipes and fittings for your next project.
        </p>
      </div>

      {/* Grid Layout - This handles the "User-Friendly" look */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {plumbingProducts.map((item) => (
            <ProductCard 
              key={item.id} 
              name={item.name} 
              size={item.size} 
              category={item.category} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlumbingCatalog;
