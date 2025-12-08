import React from "react";

const QuantitySelector = ({
  quantity,
  onQuantityChange,
  maxQuantity = 999,
  minQuantity = 1,
}) => {
  const handleDecrease = () => {
    if (quantity > minQuantity) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= minQuantity && value <= maxQuantity) {
      onQuantityChange(value);
    } else if (e.target.value === "") {
      onQuantityChange(minQuantity);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-semibold text-gray-700">Quantity:</label>
      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={quantity <= minQuantity}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 font-medium"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min={minQuantity}
          max={maxQuantity}
          className="w-16 px-2 py-1.5 text-center border-x border-gray-300 focus:outline-none focus:ring-1 focus:ring-black text-sm font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={handleIncrease}
          disabled={quantity >= maxQuantity}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 font-medium"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
