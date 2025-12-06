import Navigation from '../components/Navigation/Navigation'
import { Outlet } from 'react-router-dom'
import ChatWidget from '../components/ChatWidget/ChatWidget'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { loadUserProfile } from '@/store/userProfileSlice'
import { fetchCategories } from '@/store/categorySlice'
import { fetchUserCarts, selectCartItems } from '@/store/features/cart'
import { getToken, getUser } from '@/utils/jwt-helper'
import OrderStatusToast from '@/components/OrderStatusToast/OrderStatusToast'
import Splash from '@/components/Splash'
import Footer from '../components/Footer/Footer'
import content from '../data/content.json'

const ShopApplicationWrapper = () => {
  const dispatch = useDispatch();
  const loaded = useSelector((state)=> state?.userProfile?.loaded);
  const categoriesLoaded = useSelector((state)=> state?.categoryState?.loaded);
  const storeCart = useSelector(selectCartItems);
  const [showSplash, setShowSplash] = useState(false);
  const [cartLoaded, setLoaded] = useState(false);


  // Hiển thị splash 2 giây khi component mount (lần đầu vào hoặc refresh)
  // Nhưng không hiển thị nếu vừa login (đã hiển thị splash ở AuthenticationWrapperV2)
  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    if (justLoggedIn) {
      // Xóa flag để lần refresh sau vẫn hiển thị splash
      sessionStorage.removeItem('justLoggedIn');
      setShowSplash(false);
    } else {
      // Hiển thị splash khi refresh hoặc lần đầu vào
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    console.log("ShopApplicationWrapper");
    const token = getToken();
    if (token && !loaded) {
      dispatch(loadUserProfile());
    }
  }, [dispatch, loaded]);

  // Load categories
  useEffect(() => {
    if (!categoriesLoaded) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categoriesLoaded]);

  // Load cart when user is logged in

useEffect(() => {
  const currentUser = getUser();

  if (!cartLoaded && currentUser?.id) {
    dispatch(fetchUserCarts()).finally(() => setLoaded(true));
  }
}, [dispatch, cartLoaded]);

  return (
    <div className="min-h-screen flex flex-col">
        <OrderStatusToast />
        <Navigation />
        <main className="flex-grow">
          <Outlet />
        </main>
        {showSplash && <Splash />}
        {getUser()?.id && <ChatWidget />}
        <Footer content={content?.footer} />
    </div>
  )
}

export default ShopApplicationWrapper
