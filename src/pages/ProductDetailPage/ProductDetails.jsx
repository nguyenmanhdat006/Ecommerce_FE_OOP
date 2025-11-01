/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import _ from 'lodash';

// Components
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

// Store & API
import { addToCart } from '../../store/features/cart';
import { cartAPI } from '../../api/cart.api';
import { getAllProducts } from '../../api/fetchProducts';
import { getUser } from '../../utils/jwt-helper';

const extraSections = [
  {
    icon: <SvgCreditCard />,
    label: 'Secure payment',
  },
  {
    icon: <SvgCloth />,
    label: 'Size & Fit',
  },
  {
    icon: <SvgShipping />,
    label: 'Free shipping',
  },
  {
    icon: <SvgReturn />,
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

  //  Thiết lập breadcrumb
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

  return (
    <>
      {loadingSimilar ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Spinner />
        </div>
      ) : (
        <>
          {/* MAIN CONTENT */}
          <div className="flex flex-col md:flex-row px-10">
            {/* LEFT: Images */}
            <div className="w-[100%] lg:w-[50%] md:w-[40%]">
              <div className="flex flex-col md:flex-row">
                <div className="w-[100%] md:w-[20%] justify-center h-[40px] md:h-[420px]">
                  <div className="flex flex-row md:flex-col justify-center h-full">
                    {product?.productResources?.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => setImage(item?.url)}
                        className="rounded-lg w-fit p-2 mb-2"
                      >
                        <img
                          src={item?.url}
                          className="h-[60px] w-[60px] rounded-lg bg-cover bg-center hover:scale-105 hover:border"
                          alt={'sample-' + index}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full md:w-[80%] flex justify-center md:pt-0 pt-10">
                  <img
                    src={image}
                    className="h-full w-full max-h-[520px] border rounded-lg cursor-pointer object-cover"
                    alt={product?.name}
                  />
                </div>
              </div>
            </div>

            <div className="w-[60%] px-10">
              <Breadcrumb links={breadCrumbLinks} />
              <p className="text-3xl pt-4">{product?.name}</p>
              <Rating rating={product?.rating} />
              <p className="text-xl bold py-2">${product?.price}</p>

              {/* Size */}
              <div className="flex flex-col py-2">
                <div className="flex gap-2">
                  <p className="text-sm bold">Select Size</p>
                  <Link
                    className="text-sm text-gray-500 hover:text-gray-900"
                    to="https://en.wikipedia.org/wiki/Clothing_sizes"
                    target="_blank"
                  >
                    {'Size Guide ->'}
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <SizeFilter
                  sizes={sizes}
                  hidleTitle
                  multi={false}
                  onChange={(v) => setSelectedSize(v?.[0] ?? null)}
                />
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2 py-2">
                <label className="text-sm">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value || 1)))
                  }
                  className="w-[80px] border rounded px-2 py-1"
                />
              </div>

              {/* Colors */}
              <div>
                <p className="text-lg bold">Colors Available</p>
                <ProductColors colors={colors} />
              </div>

              {/* Add to Cart */}
              <div className="flex py-4">
                {(() => {
                  const inCart = cartItems?.some(
                    (it) => it?.id === product?.id
                  );
                  if (!inCart) {
                    return (
                      <button
                        onClick={addItemToCart}
                        className="bg-black rounded-lg hover:bg-gray-700"
                      >
                        <div className="flex h-[42px] rounded-lg w-[150px] px-2 items-center justify-center bg-black text-white hover:bg-gray-700">
                          <svg
                            width="17"
                            height="16"
                            viewBox="0 0 17 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.5 1.33325H2.00526C2.85578 1.33325 3.56986 1.97367 3.6621 2.81917L4.3379 9.014C4.43014 9.8595 5.14422 10.4999 5.99474 10.4999H13.205C13.9669 10.4999 14.6317 9.98332 14.82 9.2451L15.9699 4.73584C16.2387 3.68204 15.4425 2.65733 14.355 2.65733H4.5"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                          Add to cart
                        </div>
                      </button>
                    );
                  }
                  return (
                    <button
                      className="bg-gray-300 rounded-lg px-4 py-2"
                      disabled
                    >
                      In cart
                    </button>
                  );
                })()}
              </div>

              {/* Extra sections */}
              <div className="grid md:grid-cols-2 gap-4 pt-4">
                {extraSections?.map((section, index) => (
                  <div key={index} className="flex items-center">
                    {section?.icon}
                    <p className="px-2">{section?.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <SectionHeading title="Product Description" />
          <div className="md:w-[50%] w-full p-2">
            <p className="px-8">{product?.description}</p>
          </div>

          {/* Similar Products */}
          <SectionHeading title="Similar Products" />
          <div className="flex px-10">
            {similarProduct?.length ? (
              <div className="pt-4 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-8 px-2 pb-10">
                {similarProduct.map((item, index) => (
                  <ProductCard key={index} {...item} />
                ))}
              </div>
            ) : (
              <p>No Products Found!</p>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;
