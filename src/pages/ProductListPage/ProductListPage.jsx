/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react'
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
import { setLoading } from '../../store/features/common'
const categories = content?.categories;

const ProductListPage = ({categoryType}) => {

  const categoryData = useSelector((state)=> {
    return state?.categoryState?.categories});
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.productSlice?.loading);
  const [products,setProducts] = useState([]);

  const categoryContent = useMemo(()=>{
    return categories?.find((category)=> category.code === categoryType);
  },[categoryType]);
  
  const productListItems = useMemo(()=>{
    return content?.products?.filter((product)=> product?.category_id === categoryContent?.id );
  },[categoryContent]);

  // chỉ chạy lại khi categoryData hoặc categoryType thay đổi chứ không phải mỗi lần render
  const category = useMemo(()=>{
    return categoryData?.find(element => element?.code === categoryType);
  },[categoryData, categoryType]); // nếu đang ở women page thì sẽ hiện thị category women

  useEffect(()=>{
    if (!category?.id) return;
    dispatch(fetchProducts({ categoryId: category.id })).then((res) => {
      setProducts(res.payload || []);
    }).catch(() => {});
  },[category?.id, dispatch]);


  return (
    <div>
        <div className='flex'>
            <div className='w-[20%] p-[10px] border rounded-lg m-[20px]'>
                {/* Filters */}
                <div className='flex justify-between '>
                <p className='text-[16px] text-gray-600'>Filter</p>
                <FilterIcon />
                
                </div>
                <div>
                  {/* Product types */}
                <p className='text-[16px] text-black mt-5'>Categories</p>
                <Categories types={categoryContent?.types}/>
                <hr></hr>
                </div>
                  {/* Price */}
                  <PriceFilter />
                  <hr></hr>
                  {/* Colors */}
                  <ColorsFilter colors={categoryContent?.meta_data?.colors}/>
                  <hr></hr>
                   {/* Sizes */}
                   <SizeFilter sizes={categoryContent?.meta_data?.sizes}/>
            </div>

            <div className='p-[15px]'>
            <p className='text-black text-lg'>{category?.description}</p>
                {/* Products */}
                <div className='pt-4 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8 px-2'>
                {loading ? (
                  <Spinner />
                ) : (
                  products?.map((item,index)=>(
                  <ProductCard key={item?.id+"_"+index} {...item} title={item?.name}/>
                  ))
                )}
                </div>

            </div>

        </div>
    </div>
  )
}

export default ProductListPage