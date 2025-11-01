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
        path: "/product/:slug",
        loader: loadProductBySlug,
        element: <ProductDetails />,
      },
    ],
  },
  {
    path: "/v1/",
    element: <AuthenticationWrapper />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "oauth2/callback",
        element: <OAuth2LoginCallback />,
      },
    ],
  },
]);
