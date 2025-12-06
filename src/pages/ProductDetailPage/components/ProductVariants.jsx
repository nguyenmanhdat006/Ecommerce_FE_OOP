import React from 'react';
import { colorSelector } from '../../../components/Filters/ColorsFilter';
import QuantitySelector from './QuantitySelector';

const ProductVariants = ({ variants, selectedVariant, onSelectVariant, onQuantityChange, quantity = 1 }) => {
  if (!variants || variants.length === 0) {
    return null;
  }

  // Get max quantity from selected variant or default
  const maxQuantity = selectedVariant?.stockQuantity || 999;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const isOutOfStock = variant.stockQuantity === 0;
          const colorValue = colorSelector[variant.color] || variant.color;

          return (
            <button
              key={variant.id}
              onClick={() => !isOutOfStock && onSelectVariant(variant)}
              disabled={isOutOfStock}
              className={`
                relative flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200
                ${isSelected 
                  ? 'bg-white text-gray-900 shadow-sm border-2 border-black' 
                  : 'border-2 border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:shadow-sm'
                }
                ${isOutOfStock 
                  ? 'opacity-40 cursor-not-allowed' 
                  : 'cursor-pointer'
                }
                
              `}
              aria-label={`Select ${variant.color} ${variant.size} variant`}
            >
              {/* Color indicator */}
              <div 
                className={`w-6 h-6 rounded-full flex-shrink-0 ${
                  isSelected ? 'border-2 border-black' : 'border-2 border-gray-300'
                }`}
                style={{ backgroundColor: colorValue }}
                title={variant.color}
              />
              
              {/* Size and Color text */}
              <div className="flex flex-col items-start min-w-[80px]">
                <span className={`text-sm font-semibold ${
                  isSelected ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  {variant.color}
                </span>
                <span className={`text-xs ${
                  isSelected ? 'text-gray-600' : 'text-gray-500'
                }`}>
                  {variant.size}
                </span>
              </div>

              {/* Selected checkmark */}
              {isSelected && (
                <svg 
                  className="w-5 h-5 text-black flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2.5} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Quantity Selector */}
      {selectedVariant && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <QuantitySelector
            quantity={quantity}
            onQuantityChange={onQuantityChange}
            maxQuantity={maxQuantity}
            minQuantity={1}
          />
        </div>
      )}
    </div>
  );
};

export default ProductVariants;

