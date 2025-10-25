import { ProductsPage } from "../pages/ProductPage/ProductPage.jsx";
import { Dashboard } from "../pages/DashBoard/index.jsx";
import AddProductForm from "@/components/AddProductForm/AddProductForm.jsx";

export const adminRouter = {
  path: "/admin",
  element: <Dashboard />,
  children: [
    {
      path: "productManagement",
      element: <ProductsPage />,
    },
    {
      path: "addProduct",
      element: <AddProductForm />,
    },
  ],
};
