/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import _ from 'lodash';

import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Rating from '../../components/Rating/Rating';
import SizeFilter from '../../components/Filters/SizeFilter';
import ProductColors from './ProductColors';
import SvgCreditCard from '../../components/common/SvgCreditCard';
import SvgCloth from '../../components/common/SvgCloth';
import SvgShipping from '../../components/common/SvgShipping';
import SvgReturn from '../../components/common/SvgReturn';
import SectionHeading from '../../components/Sections/SectionsHeading/SeactionHeading';
import ProductCard from '../ProductListPage/ProductCard';
import Spinner from '../../components/Spinner/Spinner';

import { addToCart } from '../../store/features/cart';
import { cartAPI } from '../../api/cart.api';
import { getAllProducts } from '../../api/fetchProducts';
import { getUser } from '../../utils/jwt-helper';

// Icons cho phần Extra sections
const extraSections = [
  {
    icon: <SvgCreditCard className="w-5 h-5" />,
    label: 'Secure payment',
  },
  {
    icon: <SvgCloth className="w-5 h-5" />,
    label: 'Size & Fit',
  },
  {
    icon: <SvgShipping className="w-5 h-5" />,
    label: 'Free shipping',
  },
  {
    icon: <SvgReturn className="w-5 h-5" />,
    label: 'Free Shipping & Returns',
  },
];

const ProductDetails = () => {
  const { product } = useLoaderData();
  const [image, setImage] = useState();
  const [breadCrumbLinks, setBreadCrumbLink] = useState([]);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartState?.cart);
  const currentUser = getUser();
  const navigate = useNavigate();
  const [similarProduct, setSimilarProducts] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const categories = useSelector((state) => state?.categoryState?.categories);

  // Tìm category hiện tại của sản phẩm
  const productCategory = useMemo(() => {
    return categories?.find((category) => category?.id === product?.categoryId);
  }, [product, categories]);

  // Fetch các sản phẩm tương tự
  useEffect(() => {
    if (!product?.categoryId) return;
    setLoadingSimilar(true);
    getAllProducts(product?.categoryId, product?.categoryTypeId)
      .then((res) => {
        const excludedProduct = res?.filter((item) => item?.id !== product?.id);
        setSimilarProducts(excludedProduct);
      })
      .catch(() => {
        // ignore
      })
      .finally(() => setLoadingSimilar(false));
  }, [product?.categoryId, product?.categoryTypeId, product?.id]);

  useEffect(() => {
    setImage(product?.thumbnail);
    setBreadCrumbLink([]);
    const arrayLinks = [
      { title: 'Shop', path: '/' },
      {
        title: productCategory?.name,
        path: productCategory?.name,
      },
    ];
    const productType = productCategory?.categoryTypes?.find(
      (item) => item?.id === product?.categoryTypeId
    );

    if (productType) {
      arrayLinks?.push({
        title: productType?.name,
        path: productType?.name,
      });
    }
    setBreadCrumbLink(arrayLinks);
  }, [productCategory, product]);

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1); 

  // Hàm thêm sản phẩm vào giỏ hàng
  const addItemToCart = useCallback(async () => {
    if (!product) return;

    // tìm variant theo size (hoặc fallback)
    const variant =
      product?.variants?.find((v) => v.size === selectedSize) ||
      product?.variants?.[0] ||
      null;

    const payload = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      thumbnail: product.thumbnail,
      variant: variant,
      subTotal: product.price * quantity,
    };

    // cần login
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      navigate('/v1/login');
      return;
    }

    // Cập nhật local store trước (optimistic update)
    dispatch(addToCart(payload));

    try {
      const body = {
        quantity: quantity,
        userId: currentUser?.id ?? null,
        productId: product.id,
        productVariantId: variant?.id || null,
      };

      await cartAPI.addToCart(body);
      toast.success('Added to cart');
    } catch (err) {
      console.error('Add to cart API error', err);
      toast.error(err?.message || 'Failed to add to cart');
    }
  }, [dispatch, product, selectedSize, quantity, currentUser, navigate]);

  // Danh sách màu và size
  const colors = useMemo(() => {
    return _.uniq(_.map(product?.variants, 'color'));
  }, [product]);

  const sizes = useMemo(() => {
    return _.uniq(_.map(product?.variants, 'size'));
  }, [product]);
  
  // Tab hiện tại cho phần mô tả
  const [activeTab, setActiveTab] = useState('Description');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {loadingSimilar ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Spinner />
        </div>
      ) : (
        <>
          {/* MAIN CONTENT - PRODUCT DETAIL */}
          <div className="flex flex-col lg:flex-row mt-4">
            
            {/* LEFT: Images & Thumbnails */}
            <div className="w-full lg:w-1/2 flex gap-4">
              {/* Thumbnails */}
              <div className="hidden md:flex flex-col gap-2 overflow-y-auto max-h-[500px]">
                {product?.productResources?.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setImage(item?.url)}
                    className={`p-1 rounded-lg ${
                      image === item?.url ? 'border-2 border-black' : 'border'
                    }`}
                  >
                    <img
                      src={item?.url}
                      className="h-20 w-20 rounded-lg object-cover"
                      alt={'sample-' + index}
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="w-full md:w-[80%] flex justify-center">
                <img
                  src={image}
                  className="w-full max-h-[500px] object-cover rounded-lg shadow-lg"
                  alt={product?.name}
                />
              </div>
            </div>

            {/* RIGHT: Details, Controls, & Price */}
            <div className="w-full lg:w-1/2 pt-6 lg:pt-0 lg:pl-10">
                
                {/* Breadcrumb CHUẨN */}
                <Breadcrumb links={breadCrumbLinks} /> 

                <div className="mt-2">
                    
                    {/* Product Name */}
                    <h1 className="text-3xl font-semibold mb-2">{product?.name}</h1>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                        <Rating rating={product?.rating} />
                        <span className="text-sm text-gray-500 ml-2">
                            {product?.reviewsCount || 120} comment
                        </span>
                    </div>
                </div>


                {/* Size Selector */}
                <div className="mb-4">
                    <div className="flex items-center gap-4 mb-2">
                        <p className="text-sm font-semibold">Select Size</p>
                        <Link
                            className="text-sm text-gray-500 hover:text-gray-900 underline"
                            to="https://en.wikipedia.org/wiki/Clothing_sizes"
                            target="_blank"
                        >
                            Size Guide
                        </Link>
                    </div>
                    <SizeFilter
                        sizes={sizes}
                        hidleTitle
                        multi={false}
                        onChange={(v) => setSelectedSize(v?.[0] ?? null)}
                        className="space-x-2"
                        buttonClass="w-10 h-10 border rounded-lg flex items-center justify-center font-medium"
                        activeClass="border-black text-black bg-white"
                    />
                </div>

                {/* Colors */}
                <div className="mb-6">
                    <p className="text-sm font-semibold mb-2">Colors Available</p>
                    <ProductColors colors={colors} />
                </div>

                {/* Price & Add to Cart */}
                <div className="flex items-center gap-4 mb-6 pt-2">
                    {(() => {
                        const inCart = cartItems?.some((it) => it?.id === product?.id);
                        return (
                            <>
                                {/* Add to Cart Button */}
                                <button
                                    onClick={addItemToCart}
                                    className="flex items-center justify-center bg-black text-white font-medium h-10 w-40 rounded-lg hover:bg-gray-800 transition duration-300"
                                    disabled={inCart}
                                >
                                    Add to cart
                                </button>

                                {/* Price Display */}
                                <p className="text-2xl font-bold text-gray-800">${product?.price}</p>
                            </>
                        );
                    })()}
                </div>

                {/* Extra sections - Secured Payment, etc. */}
                <div className="grid grid-cols-2 gap-y-4 border-t pt-6">
                    {extraSections?.map((section, index) => (
                        <div key={index} className="flex items-center">
                            {section?.icon}
                            <p className="ml-2 text-sm text-gray-600">{section?.label}</p>
                        </div>
                    ))}
                </div>
            </div>
          </div>
          
          <hr className="my-10" />

          {/* DESCRIPTION & VIDEO SECTION */}
          <div className="mt-12 flex flex-col lg:flex-row gap-8">
            {/* LEFT: Product Description & Tabs */}
            <div className="w-full lg:w-1/2">
                
                {/* Tabs for Description, Comments, Q&A */}
                <div className="border-b mb-4">
                    <div className="flex space-x-6">
                        {/* Giả lập các tab với state activeTab */}
                        {['Description', 'User comments (1)', 'Question & Answer (4)'].map((tabTitle) => (
                            <button
                                key={tabTitle}
                                onClick={() => setActiveTab(tabTitle.split(' ')[0])}
                                className={`pb-2 text-sm font-medium ${
                                    activeTab === tabTitle.split(' ')[0]
                                        ? 'border-b-2 border-black text-black'
                                        : 'text-gray-500 hover:text-black'
                                }`}
                            >
                                {tabTitle}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Nội dung Description */}
                {activeTab === 'Description' && (
                    <div className="pt-2">
                        <p className="text-sm text-gray-600 mb-6">
                            {product?.description || "No description available for this product."}
                        </p>

                    </div>
                )}
            </div>

            {/* RIGHT: Video Placeholder */}
            <div className="w-full lg:w-1/2">
              <div className=" relative overflow-hidden rounded-lg shadow-lg aspect-video bg-black">
                <img
                  src={product?.thumbnail} 
                  alt="Product Video Thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-8 h-8 text-black ml-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.5 5.653c0-1.426 1.529-2.38 2.875-1.667l11.54 6.348c1.24 1.24 1.24 3.242 0 4.482l-11.54 6.348c-1.346.713-2.875-.24-2.875-1.667V5.653z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded text-xs">
                    1:00 M
                </div>
              </div>
            </div>
          </div>

          <hr className="my-10" />

          {/* Similar Products */}
          <SectionHeading title="Similar Products" />
          <div className="pt-4 pb-10">
            {similarProduct?.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {similarProduct.map((item, index) => (
                  <ProductCard key={index} {...item} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No Similar Products Found!</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetails;