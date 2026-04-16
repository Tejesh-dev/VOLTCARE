import React from 'react';

// This defines what information each card needs
interface ProductProps {
  name: string;
  size: string;
  category: string;
}

const ProductCard: React.FC<ProductProps> = ({ name, size, category }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all p-5 flex flex-col items-center text-center group">
      
      {/* Visual Icon Area */}
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
        <svg 
          className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
          />
        </svg>
      </div>

      {/* Product Information */}
      <span className="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest mb-1">
        {category}
      </span>
      <h3 className="text-lg font-bold text-gray-800 leading-tight h-12 flex items-center">
        {name}
      </h3>
      <div className="mt-2 mb-4">
        <span className="text-xs text-gray-400 block uppercase font-semibold">Size</span>
        <span className="text-sm font-bold text-gray-600">{size}</span>
      </div>

      {/* Action Button */}
      <button className="w-full bg-gray-900 hover:bg-blue-600 text-white font-bold py-2.5 rounded-lg transition-colors text-sm shadow-md active:scale-95 transform">
        View Item
      </button>
    </div>
  );
};

export default ProductCard;
