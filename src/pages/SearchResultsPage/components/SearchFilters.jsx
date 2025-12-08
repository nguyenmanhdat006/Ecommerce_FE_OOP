import React from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/currencyFormatter';

export function SearchPriceFilter({ minPrice, maxPrice, onPriceChange }) {
  const handleRangeChange = (values) => {
    onPriceChange({
      minPrice: values[0] * 10000,
      maxPrice: values[1] * 10000
    });
  };

  return (
    <div className='flex flex-col mb-4'>
      <p className='text-[16px] text-black mt-5 mb-5'>Giá</p>
      <RangeSlider 
        className={'custom-range-slider'} 
        min={0} 
        max={1000} 
        defaultValue={[minPrice / 10000 || 0, maxPrice / 10000 || 1000]} 
        onInput={handleRangeChange}
      />
      <div className='flex justify-between'>
        <div className='border rounded-lg h-8 mt-4 max-w-[50%] w-[40%] flex items-center'>
          <input 
            type='text' 
            value={formatCurrency(minPrice || 0, { currency: 'USD', locale: 'en-US', minimumFractionDigits: 0, maximumFractionDigits: 0 })} 
            className='outline-none px-4 text-gray-600 w-full' 
            disabled 
            placeholder='Min'
          />
        </div>
        <div className='border rounded-lg h-8 mt-4 max-w-[50%] w-[40%] flex items-center'>
          <input 
            type='text' 
            value={formatCurrency(maxPrice || 10000, { currency: 'USD', locale: 'en-US', minimumFractionDigits: 0, maximumFractionDigits: 0 })} 
            className='outline-none px-4 text-gray-600 w-full' 
            disabled 
            placeholder='Max' />
        </div>
      </div>
    </div>
  )
}
export function SearchRatingFilter({ minRating, onRatingChange }) {
  const ratings = [5, 4, 3, 2, 1];

  return (
    <div className='flex flex-col mb-4'>
      <p className='text-[16px] text-black mt-5 mb-3'>Đánh giá</p>
      <div className='space-y-2'>
        {ratings.map((rating) => (
          <label key={rating} className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded'>
            <input
              type='radio'
              name='rating'
              value={rating}
              checked={minRating === rating}
              onChange={() => onRatingChange(rating)}
              className='cursor-pointer'
            />
            <div className='flex items-center gap-1'>
              {[...Array(rating)].map((_, i) => (
                <Star key={i} size={16} className='fill-yellow-400 text-yellow-400' />
              ))}
              <span className='text-sm text-gray-600'>trở lên</span>
            </div>
          </label>
        ))}
        <label className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded'>
          <input
            type='radio'
            name='rating'
            checked={!minRating}
            onChange={() => onRatingChange(null)}
            className='cursor-pointer'
          />
          <span className='text-sm text-gray-600'>Tất cả</span>
        </label>
      </div>
    </div>
  );
}

export function SearchSortFilter({ sortBy, sortDirection, onSortChange }) {
  const sortOptions = [
    { label: 'Tên (A-Z)', value: 'name', direction: 'asc' },
    { label: 'Tên (Z-A)', value: 'name', direction: 'desc' },
    { label: 'Giá thấp đến cao', value: 'price', direction: 'asc' },
    { label: 'Giá cao đến thấp', value: 'price', direction: 'desc' },
    { label: 'Đánh giá cao nhất', value: 'rating', direction: 'desc' },
    { label: 'Mới nhất', value: 'createdAt', direction: 'desc' },
  ];

  const currentSort = `${sortBy}_${sortDirection}`;

  return (
    <div className='flex flex-col mb-4'>
      <p className='text-[16px] text-black mt-5 mb-3'>Sắp xếp theo</p>
      <div className='space-y-2'>
        {sortOptions.map((option) => {
          const value = `${option.value}_${option.direction}`;
          return (
            <label key={value} className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded'>
              <input
                type='radio'
                name='sort'
                value={value}
                checked={currentSort === value}
                onChange={() => onSortChange(option.value, option.direction)}
                className='cursor-pointer'
              />
              <span className='text-sm text-gray-600'>{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function SearchNewArrivalFilter({ isNewArrival, onNewArrivalChange }) {
  return (
    <div className='flex flex-col mb-4'>
      <p className='text-[16px] text-black mt-5 mb-3'>Sản phẩm mới</p>
      <label className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded'>
        <input
          type='checkbox'
          checked={isNewArrival}
          onChange={(e) => onNewArrivalChange(e.target.checked)}
          className='cursor-pointer'
        />
        <span className='text-sm text-gray-600'>Chỉ hiển thị sản phẩm mới</span>
      </label>
    </div>
  );
}

export function SearchBrandFilter({ brands, selectedBrand, onBrandChange }) {
  if (!brands || brands.length === 0) return null;

  return (
    <div className='flex flex-col mb-4'>
      <p className='text-[16px] text-black mt-5 mb-3'>Thương hiệu</p>
      <div className='space-y-2 max-h-48 overflow-y-auto'>
        <label className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded'>
          <input
            type='radio'
            name='brand'
            checked={!selectedBrand}
            onChange={() => onBrandChange(null)}
            className='cursor-pointer'
          />
          <span className='text-sm text-gray-600'>Tất cả</span>
        </label>
        {brands.map((brand) => (
          <label key={brand} className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded'>
            <input
              type='radio'
              name='brand'
              value={brand}
              checked={selectedBrand === brand}
              onChange={() => onBrandChange(brand)}
              className='cursor-pointer'
            />
            <span className='text-sm text-gray-600'>{brand}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function ClearFiltersButton({ onClear }) {
  return (
    <Button 
      variant="outline" 
      className="w-full mt-4" 
      onClick={onClear}
    >
      Xóa bộ lọc
    </Button>
  );
}

