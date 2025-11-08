import "./Shop.css";
import HeroSection from "./components/HeroSection/HeroSection.jsx";
import NewArrivals from "./components/Sections/NewArrivals.jsx";
import Category from "./components/Sections/Categories/Category.jsx";
import content from "./data/content.json";
import Footer from "./components/Footer/Footer.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getToken, getUser } from "./utils/jwt-helper.js";
import { logout, setCredentials } from "./store/authSlice.jsx";
import { fetchCategories } from "./store/categorySlice.jsx";
import OrderStatusToast from "./components/OrderStatusToast/OrderStatusToast.jsx";

const Shop = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = getToken();
    const user = getUser();
    console.log("accessToken", accessToken);
    console.log("user", user);
    if (accessToken && user) {
      dispatch(setCredentials({ accessToken, user }));
    } else {
      dispatch(logout());
    }

  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <>
      <OrderStatusToast />
      <HeroSection />
      <NewArrivals />
      {content?.pages?.shop?.sections &&
        content.pages.shop.sections.map((item, index) => (
          <Category key={item?.title + index} {...item} />
        ))}
      <Footer content={content?.footer} />
    </>
  );
};

export default Shop;
