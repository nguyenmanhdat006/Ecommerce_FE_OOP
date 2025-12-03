/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react';
import FilterIcon from '../../components/common/FilterIcon';
import content from '../../data/content.json';
import Categories from '../../components/Filters/Categories';
import PriceFilter from '../../components/Filters/PriceFilter';
import ColorsFilter from '../../components/Filters/ColorsFilter';
import SizeFilter from '../../components/Filters/SizeFilter';
import ProductCard from './ProductCard';
import { fetchProducts } from '../../store/productSlice';
import Spinner from '../../components/Spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';

const categories = content?.categories;

const ProductListPage = ({ categoryType }) => {
  const categoryData = useSelector((state) => state?.categoryState?.categories);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.productSlice?.loading);
  const [products, setProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const categoryContent = useMemo(() => {
    return categories?.find((category) => category.code === categoryType);
  }, [categoryType]);

  const category = useMemo(() => {
    return categoryData?.find((element) => element?.code === categoryType);
  }, [categoryData, categoryType]);

  const storeProducts = useSelector((state) => state.productState?.products || []);
  const storeLoaded = useSelector((state) => state.productState?.loaded);

  useEffect(() => {
    if (!category?.id) return;
    // Only fetch if store has no products or not loaded
    if (!storeLoaded || !storeProducts || storeProducts.length === 0) {
      dispatch(fetchProducts({ categoryId: category.id }))
        .then((res) => setProducts(res.payload || []))
        .catch(() => {});
    } else {
      // Use cached products filtered by category if available
      setProducts(storeProducts.filter(p => p.categoryId === category.id));
    }
  }, [category?.id, dispatch, storeProducts, storeLoaded]);

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
        <div className="lg:hidden p-[10px] border rounded-lg mx-[20px] mb-[20px]">
          <div className="flex justify-between">
            <p className="text-[16px] text-gray-600">Filter</p>
            <FilterIcon />
          </div>

          <div>
            <p className="text-[16px] text-black mt-5">Categories</p>
            <Categories types={categoryContent?.types} />
            <hr />
          </div>

          <PriceFilter />
          <hr />

          <ColorsFilter colors={categoryContent?.meta_data?.colors} />
          <hr />

          <SizeFilter sizes={categoryContent?.meta_data?.sizes} />
        </div>
      )}

      {/* Layout chính */}
      <div className="flex flex-col lg:flex-row">
        {/* Cột trái: Filters - chỉ hiện trên desktop */}
        <div className="hidden lg:block lg:w-[20%] p-[10px] border rounded-lg m-[20px] min-w-[250px]">
          <div className="flex justify-between">
            <p className="text-[16px] text-gray-600">Filter</p>
            <FilterIcon />
          </div>

          <div>
            <p className="text-[16px] text-black mt-5">Categories</p>
            <Categories types={categoryContent?.types} />
            <hr />
          </div>

          <PriceFilter />
          <hr />

          <ColorsFilter colors={categoryContent?.meta_data?.colors} />
          <hr />

          <SizeFilter sizes={categoryContent?.meta_data?.sizes} />
        </div>

        {/* Cột phải: Products */}
        <div className="p-[15px] flex-grow w-full">
          <p className="text-black text-lg">{category?.description}</p>

          {/* Products Grid: Responsive - 1 đến 5 cột */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-2">
            {loading ? (
              <div className="col-span-full flex justify-center">
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