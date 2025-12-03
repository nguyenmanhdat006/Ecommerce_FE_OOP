import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { productAPI } from '@/api/product.api';
import ProductCard from '../ProductListPage/ProductCard';
import Spinner from '@/components/Spinner/Spinner';
import FilterSidebar from '@/components/Filters/FilterSidebar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '@/components/Filters/priceFillter.css';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
    pageSize: 12,
    hasNext: false,
    hasPrevious: false
  });
  const [availableBrands, setAvailableBrands] = useState([]);

  // Filters from URL
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    categoryId: searchParams.get('categoryId') || null,
    typeId: searchParams.get('typeId') || null,
    brand: searchParams.get('brand') || null,
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')) : null,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')) : null,
    minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')) : null,
    isNewArrival: searchParams.get('isNewArrival') === 'true',
    sortBy: searchParams.get('sortBy') || 'name',
    sortDirection: searchParams.get('sortDirection') || 'asc',
    page: searchParams.get('page') ? parseInt(searchParams.get('page')) : 0,
    size: 12
  });

  // Fetch products
  const fetchSearchResults = useCallback(async () => {
    setLoading(true);
    try {
      // Clean up params - remove null/undefined values
      const cleanParams = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      const response = await productAPI.search(cleanParams);
      
      setProducts(response.products || []);
      setPagination({
        currentPage: response.currentPage,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
        pageSize: response.pageSize,
        hasNext: response.hasNext,
        hasPrevious: response.hasPrevious
      });

      // Extract unique brands from results
      const brands = [...new Set(response.products?.map(p => p.brand).filter(Boolean))];
      setAvailableBrands(brands);
    } catch (error) {
      console.error('Search error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  // Update URL when filters change
  const updateURL = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && key !== 'size') {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);
  };

  // Filter handlers
  const handleFilterChange = (updates) => {
    const newFilters = { ...filters, ...updates, page: 0 }; // Reset to page 0 when filters change
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handlePriceChange = ({ minPrice, maxPrice }) => {
    handleFilterChange({ minPrice, maxPrice });
  };

  const handleRatingChange = (minRating) => {
    handleFilterChange({ minRating });
  };

  const handleSortChange = (sortBy, sortDirection) => {
    handleFilterChange({ sortBy, sortDirection });
  };

  const handleNewArrivalChange = (isNewArrival) => {
    handleFilterChange({ isNewArrival });
  };

  const handleBrandChange = (brand) => {
    handleFilterChange({ brand });
  };

  const handlePageChange = (newPage) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    updateURL(newFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      keyword: filters.keyword, // Keep keyword
      categoryId: null,
      typeId: null,
      brand: null,
      minPrice: null,
      maxPrice: null,
      minRating: null,
      isNewArrival: false,
      sortBy: 'name',
      sortDirection: 'asc',
      page: 0,
      size: 12
    };
    setFilters(clearedFilters);
    updateURL(clearedFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className='flex flex-col md:flex-row gap-6'>
        {/* Sidebar Filters */}
        <div className='w-full md:w-[280px] lg:w-[300px]'>
          <div className='sticky top-20'>
            <FilterSidebar
              filters={filters}
              availableBrands={availableBrands}
              onPriceChange={handlePriceChange}
              onRatingChange={handleRatingChange}
              onSortChange={handleSortChange}
              onNewArrivalChange={handleNewArrivalChange}
              onBrandChange={handleBrandChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>

        {/* Results */}
        <div className='flex-1'>
          {/* Results Header */}
          <div className='mb-6'>
            <h1 className='text-2xl font-bold mb-2'>
              {filters.keyword ? `Kết quả tìm kiếm cho "${filters.keyword}"` : 'Tất cả sản phẩm'}
            </h1>
            <p className='text-gray-600'>
              Tìm thấy {pagination.totalItems} sản phẩm
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className='flex justify-center items-center py-20'>
              <Spinner />
            </div>
          ) : products.length === 0 ? (
            <div className='text-center py-20'>
              <p className='text-lg text-gray-500'>Không tìm thấy sản phẩm nào</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/')}
              >
                Về trang chủ
              </Button>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    {...product} 
                    title={product.name}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className='flex justify-center items-center gap-4 mt-8'>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={!pagination.hasPrevious}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                  >
                    <ChevronLeft size={20} />
                  </Button>
                  
                  <div className='flex items-center gap-2'>
                    {[...Array(pagination.totalPages)].map((_, index) => (
                      <Button
                        key={index}
                        variant={pagination.currentPage === index ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(index)}
                        className="w-10 h-10"
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    disabled={!pagination.hasNext}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                  >
                    <ChevronRight size={20} />
                  </Button>
                </div>
              )}

              {/* Pagination Info */}
              <div className='text-center mt-4 text-sm text-gray-600'>
                Trang {pagination.currentPage + 1} / {pagination.totalPages}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;

