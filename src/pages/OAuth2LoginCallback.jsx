import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken, saveUser } from "../utils/jwt-helper";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../store/authSlice";
import { loadUserProfile } from "../store/userProfileSlice";
import { getToken } from "../utils/jwt-helper";

const OAuth2LoginCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { profile: user, loadingProfile } = useSelector((state) => state.userProfileSlice);

  const urlToken = new URLSearchParams(window.location.search).get("token");
  const localToken = getToken();
  // Step 1: Save token & load user
  useEffect(() => {
    if (!urlToken && !localToken) {
      navigate("/v1/login");
      return;
    }

    saveToken(urlToken || localToken);
    dispatch(loadUserProfile());
  }, [urlToken, localToken, dispatch, navigate]);

  // Step 2: when user loaded → save & redirect
  useEffect(() => {
    if (loadingProfile === false && user) {
      saveUser(user);
      dispatch(setCredentials({ accessToken: urlToken || localToken, user }));
      navigate("/");
    }

    if (loadingProfile === false && user === null && !urlToken && !localToken) {
      navigate("/v1/login");
    }
  }, [loadingProfile, user, urlToken, localToken, navigate, dispatch]);

  return <div>Đang đăng nhập...</div>;
};

export default OAuth2LoginCallback;
