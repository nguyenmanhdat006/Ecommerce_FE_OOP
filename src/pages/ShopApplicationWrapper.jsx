import Navigation from '../components/Navigation/Navigation'
import { Outlet } from 'react-router-dom'
import ChatWidget from '../components/ChatWidget/ChatWidget'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { loadUserProfile } from '@/store/userProfileSlice'
import { getToken, getUser } from '@/utils/jwt-helper'
import OrderStatusToast from '@/components/OrderStatusToast/OrderStatusToast'
import Splash from '@/components/Splash'
import Footer from '../components/Footer/Footer'
import content from '../data/content.json'

const ShopApplicationWrapper = () => {
  const dispatch = useDispatch();
  const loaded = useSelector((state)=> state?.userProfile?.loaded);
  const [showSplash, setShowSplash] = useState(true);

  // Hiển thị splash 2 giây khi component mount (lần đầu vào hoặc refresh)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log("ShopApplicationWrapper");
    const token = getToken();
    if (token && !loaded) {
      dispatch(loadUserProfile());
    }
  }, [dispatch, loaded]);

  return (
    <div>
        <OrderStatusToast />
        <Navigation />
        <Outlet />
        {showSplash && <Splash />}
        {getUser()?.id && <ChatWidget />}
        <Footer content={content?.footer} />
    </div>
  )
}

export default ShopApplicationWrapper