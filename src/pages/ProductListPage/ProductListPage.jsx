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

  const categoryContent = useMemo(() => {
    return categories?.find((category) => category.code === categoryType);
  }, [categoryType]);

  const category = useMemo(() => {
    return categoryData?.find((element) => element?.code === categoryType);
  }, [categoryData, categoryType]);

  useEffect(() => {
    if (!category?.id) return;
    dispatch(fetchProducts({ categoryId: category.id }))
      .then((res) => setProducts(res.payload || []))
      .catch(() => {});
  }, [category?.id, dispatch]);

  return (
    <div>
      {/* Sử dụng flex để chia cột */}
      <div className="flex">
        {/* Cột trái: Filters */}
        <div className="w-[20%] p-[10px] border rounded-lg m-[20px] min-w-[250px]">
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
        <div className="p-[15px] flex-grow">
          <p className="text-black text-lg">{category?.description}</p>

          {/* Products Row: 1 hàng 5 sản phẩm */}
          <div className="pt-4 flex flex-row flex-nowrap gap-4 overflow-x-auto px-2">
            {loading ? (
              <Spinner />
            ) : products?.length > 0 ? (
              products?.slice(0, 5).map((item, index) => (
                <div key={item?.id + '_' + index} className="flex-shrink-0 w-1/5">
                  <ProductCard {...item} title={item?.name} />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-10 w-full">
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
