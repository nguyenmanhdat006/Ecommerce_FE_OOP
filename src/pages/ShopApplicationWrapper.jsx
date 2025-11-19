import Navigation from '../components/Navigation/Navigation'
import { Outlet } from 'react-router-dom'
import Spinner from '../components/Spinner/Spinner'
import ChatWidget from '../components/ChatWidget/ChatWidget'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { loadUserProfile } from '@/store/userProfileSlice'
import { getToken, getUser } from '@/utils/jwt-helper'
import OrderStatusToast from '@/components/OrderStatusToast/OrderStatusToast'
import Splash from '@/components/Splash'
import Footer from '../components/Footer/Footer'
import content from '../data/content.json'

const ShopApplicationWrapper = () => {
  const dispatch = useDispatch();
  const loaded = useSelector((state)=> state?.userProfile?.loaded);
  useEffect(() => {
    console.log("ShopApplicationWrapper");
    const token = getToken();
    if (token && !loaded) {
      dispatch(loadUserProfile());
    }
  }, [dispatch, loaded]);

  const isLoading = useSelector((state)=> state?.userProfile?.loadingProfile);
  return (
    <div>
        <OrderStatusToast />
        <Navigation />
        <Outlet />
        {isLoading && <Splash />}
        {getUser()?.id && <ChatWidget />}
        <Footer content={content?.footer} />
    </div>
  )
}

export default ShopApplicationWrapper