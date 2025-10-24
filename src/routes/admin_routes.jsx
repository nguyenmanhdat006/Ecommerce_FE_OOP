import { ProductsPage } from "../pages/ProductPage/ProductPage.jsx";
import { Dashboard } from "../pages/DashBoard/index.jsx";

export const adminRouter = {
  path: "/admin",
  element: <Dashboard />,
  children: [
    {
      path: "productManagement",
      element: <ProductsPage />,
    },
  ],
};
