import Navigation from '../components/Navigation/Navigation'
import { Outlet } from 'react-router-dom'
import Spinner from '../components/Spinner/Spinner'
import ChatWidget from '../components/ChatWidget/ChatWidget'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { loadUserProfile } from '@/store/userProfileSlice'
import { getToken, getUser } from '@/utils/jwt-helper'

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
        <Navigation />
        <Outlet />
        {isLoading && <Spinner />}
        {getUser()?.id && <ChatWidget />}
    </div>
  )
}

export default ShopApplicationWrapper