import React from 'react';
import FilterIcon from '../common/FilterIcon';
import { 
  SearchPriceFilter, 
  SearchRatingFilter, 
  SearchSortFilter,
  SearchNewArrivalFilter,
  SearchBrandFilter,
  ClearFiltersButton
} from '@/pages/SearchResultsPage/components/SearchFilters';

const FilterSidebar = ({
  filters = {},
  availableBrands = [],
  onFilterChange,
  onPriceChange,
  onRatingChange,
  onSortChange,
  onNewArrivalChange,
  onBrandChange,
  onClearFilters,
  className = '',
  showBrandFilter = true,
}) => {
  return (
    <div className={`border rounded-lg p-4 ${className}`}>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-semibold'>Bộ lọc</h2>
        <FilterIcon />
      </div>

      {/* Price Filter */}
      <SearchPriceFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onPriceChange={onPriceChange}
      />
      <hr className='my-4' />

      {/* Rating Filter */}
      <SearchRatingFilter
        minRating={filters.minRating}
        onRatingChange={onRatingChange}
      />
      <hr className='my-4' />

      {/* Sort Filter */}
      <SearchSortFilter
        sortBy={filters.sortBy}
        sortDirection={filters.sortDirection}
        onSortChange={onSortChange}
      />
      <hr className='my-4' />

      {/* New Arrival Filter */}
      <SearchNewArrivalFilter
        isNewArrival={filters.isNewArrival}
        onNewArrivalChange={onNewArrivalChange}
      />
      
      {/* Brand Filter */}
      {showBrandFilter && availableBrands.length > 0 && (
        <>
          <hr className='my-4' />
          <SearchBrandFilter
            brands={availableBrands}
            selectedBrand={filters.brand}
            onBrandChange={onBrandChange}
          />
        </>
      )}

      {/* Clear Filters Button */}
      {onClearFilters && (
        <ClearFiltersButton onClear={onClearFilters} />
      )}
    </div>
  );
};

export default FilterSidebar;

