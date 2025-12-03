/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import FilterIcon from '../../components/common/FilterIcon';
import content from '../../data/content.json';
import ProductCard from './ProductCard';
import { productAPI } from '@/api/product.api';
import Spinner from '../../components/Spinner/Spinner';
import { useSelector } from 'react-redux';
import FilterSidebar from '@/components/Filters/FilterSidebar';
import '@/components/Filters/priceFillter.css';

const categories = content?.categories;

const ProductListPage = ({ categoryType }) => {
  const categoryData = useSelector((state) => state?.categoryState?.categories);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [availableBrands, setAvailableBrands] = useState([]);

  const categoryContent = useMemo(() => {
    return categories?.find((category) => category.code === categoryType);
  }, [categoryType]);

  const category = useMemo(() => {
    return categoryData?.find((element) => element?.code === categoryType);
  }, [categoryData, categoryType]);

  const storeProducts = useSelector((state) => state.productState?.products || []);
  const storeLoaded = useSelector((state) => state.productState?.loaded);

  // Filters state
  const [filters, setFilters] = useState({
    categoryId: null,
    minPrice: null,
    maxPrice: null,
    minRating: null,
    isNewArrival: false,
    sortBy: 'name',
    sortDirection: 'asc',
    brand: null,
  });

  // Update categoryId when category changes
  useEffect(() => {
    if (!category?.id) return;
    dispatch(fetchProducts({ categoryId: category.id }))
      .then((res) => setProducts(res.payload || []))
      .catch(() => {});
  }, [category?.id, dispatch]);

  return (
    <div>
      {/* Button hiển thị Filter trên mobile */}
      <div className="lg:hidden p-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white shadow-sm hover:bg-gray-50"
        >
          <FilterIcon />
          <span className="text-[16px] text-gray-600">
            {showFilters ? 'Ẩn Filter' : 'Hiện Filter'}
          </span>
        </button>
      </div>

      {/* Filters trên mobile (có thể mở/đóng) */}
      {showFilters && (
        <div className="lg:hidden mx-[20px] mb-[20px]">
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
      )}

      {/* Layout chính */}
      <div className="flex flex-col lg:flex-row">
        {/* Cột trái: Filters - chỉ hiện trên desktop */}
        <div className="hidden lg:block lg:w-[20%] m-[20px] min-w-[250px]">
          <div className="sticky top-20">
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

        {/* Cột phải: Products */}
        <div className="p-[15px] flex-grow w-full">
          <p className="text-black text-lg">{category?.description}</p>

          {/* Products Grid: Responsive - 1 đến 5 cột */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-2">
            {loading ? (
              <div className="col-span-full flex justify-center py-20">
                <Spinner />
              </div>
            ) : products?.length > 0 ? (
              products.map((item, index) => (
                <div key={item?.id + '_' + index}>
                  <ProductCard {...item} title={item?.name} />
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10">
                Không tìm thấy sản phẩm nào.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;