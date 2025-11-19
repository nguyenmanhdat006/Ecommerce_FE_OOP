import { createBrowserRouter } from "react-router-dom";
import Shop from "./Shop";
import ProductListPage from "./pages/ProductListPage/ProductListPage.jsx";
import ProductDetails from "./pages/ProductDetailPage/ProductDetails.jsx";
import CartPage from "./pages/CartPage/CartPage.jsx";
import ShopApplicationWrapper from "./pages/ShopApplicationWrapper.jsx";
import { loadProductBySlug } from "./routes/product.js";
import AuthenticationWrapper from "./pages/AuthenticationWrapper.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import OAuth2LoginCallback from "./pages/OAuth2LoginCallback.jsx";
import { adminRouter } from "./routes/admin_routes.jsx";
import OwnerProfile from "./pages/UserProfile/OwnerProfile.jsx";
import CheckoutPage from "./pages/Checkout/Checkout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import OrderVnpSuccess from "./pages/Checkout/vnpayDone.jsx";
import Chat from "./pages/Chat.jsx";
import SearchResultsPage from "./pages/SearchResultsPage/SearchResultsPage.jsx";
import LoginV2 from "./pages/Login/LoginV2.jsx";
import LoginForm from "./forms/LoginForm.jsx";
import RegisterForm from "./forms/RegisterForm.jsx";
import ForgotForm from "./forms/ForgotForm.jsx";
import Splash from "./components/Splash.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ShopApplicationWrapper />,
    children: [
      adminRouter,
      {
        path: "/",
        element: <Shop />,
      },
      {
        path: "/chat",
        element: <Chat />,
      },
      {
        path: "/search",
        element: <SearchResultsPage />,
      },
      {
        path: "/profile",
        element: <OwnerProfile />,
      },
      {
        path: "/women",
        element: <ProductListPage categoryType="WOMEN" />,
      },
      {
        path: "/men",
        element: <ProductListPage categoryType="MEN" />,
      },
      {
        path: "/kids",
        element: <ProductListPage categoryType="KIDS" />,
      },
      {
        path: "/product/:slug",
        loader: loadProductBySlug,
        element: <ProductDetails />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/checkout",
        element: <CheckoutPage />,
      },
      {
        path: "/order-success/",
        element: <OrderSuccess />,
      },
      {
        path: "/vnpay-done/:orderId",
        element: <OrderVnpSuccess />,
      },
    ],
  },
  {
    path: "/splash",
    element: <Splash />,
  },
  {
    path: "/v1/",
    element: <AuthenticationWrapper />,
    children: [
      {
        path: "login",
        element: <LoginForm />,
      },
      {
        path: "register",
        element: <RegisterForm />,
      },
      {
        path: "forgot",
        element: <ForgotForm />,
      },
      {
        path: "oauth2/callback",
        element: <OAuth2LoginCallback />,
      },
    ],
  },
]);
