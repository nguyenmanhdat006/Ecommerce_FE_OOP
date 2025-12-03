import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken, saveUser } from "../utils/jwt-helper";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../store/authSlice";
import { loadUserProfile } from "../store/userProfileSlice";
import { fetchUserCarts } from '@/store/features/cart';
import { getToken } from "../utils/jwt-helper";
import Splash from "@/components/Splash"

const OAuth2LoginCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSplash, setShowSplash] = useState(true);

  const { profile: user, loadingProfile } = useSelector((state) => state.userProfileSlice);

  const urlToken = new URLSearchParams(window.location.search).get("token");
  const localToken = getToken();
  
  // Step 1: Save token & load user
  useEffect(() => {
    if (!urlToken && !localToken) {
      navigate("/v2/login");
      return;
    }

    if (urlToken) {
      saveToken(urlToken);
      dispatch(loadUserProfile());
    }
  }, [urlToken, localToken, dispatch, navigate]);

  // Step 2: when user loaded → save & redirect with splash
  useEffect(() => {
    if (loadingProfile === false && user) {
      saveUser(user);
      dispatch(setCredentials({ accessToken: urlToken || localToken, user }));
      navigate("/");
    }

    if (loadingProfile === false && user === null && !urlToken && !localToken) {
      setShowSplash(false);
      navigate("/v2/login");
    }
  }, [loadingProfile, user, urlToken, localToken, navigate, dispatch]);

  return showSplash ? <Splash /> : null;
};

export default OAuth2LoginCallback;
