import { ProductsPage } from "../pages/ProductPage/ProductPage.jsx";
import { Dashboard } from "../pages/DashBoard/index.jsx";
import AddProductForm from "@/forms/AddProductForm/AddProductForm.jsx";
import { UsersPage } from "@/pages/UserManagement/UsersPage.jsx";
import { ROUTE_CONSTANTS } from "@/constants/routeConstants";
import { EditProductForm } from "@/forms/EditProductForm/EditProductForm.jsx";

export const adminRouter = {
  path: "/admin",
  element: <Dashboard />,
  children: [
    {
      path: ROUTE_CONSTANTS.ADMIN_PRODUCT_LIST,
      element: <ProductsPage />,
    },
    {
      path: ROUTE_CONSTANTS.ADMIN_PRODUCT_ADD,
      element: <AddProductForm />,
    },
    {
      path: ROUTE_CONSTANTS.ADMIN_USER_LIST,
      element: <UsersPage />,
    },
    {
      path: "update-product",
      element: <EditProductForm />,
    },
  ],
};
