import ProductPage from "../pages/ProductPage/ProductPage.jsx";
import { Dashboard } from "../pages/DashBoard/index.jsx";
import AddProductForm from "@/forms/AddProductForm/AddProductForm.jsx";
import { UsersPage } from "@/pages/UserManagement/UsersPage.jsx";
import { ROUTE_CONSTANTS } from "@/constants/routeConstants";
import { EditProductForm } from "@/forms/EditProductForm/EditProductForm.jsx";

import OrdersPage from "@/pages/OrdersPage/OrdersPage.jsx";
import OrderDetailPage from "@/pages/OrdersDetailPage/OrdersDetailPage.jsx";
import ProductDetail from "@/forms/ProductDetail/ProductDetail.jsx";
import { CategoryTypePage } from "@/pages/CategoryTypePage/CategoryTypePage.jsx";
import { CategoryPage } from "@/pages/CategoryPage/CategoryPage.jsx";
import { InventoryManagement } from "@/components/InventoryManagement/InventoryManagement.jsx";
import AdminChat from "@/pages/AdminChat/AdminChat.jsx";
import DashboardHome from "@/pages/DashboardHome/DashboardHome.jsx";

export const adminRouter = {
  path: "/admin",
  element: <Dashboard />,
  children: [
    {
      path: ROUTE_CONSTANTS.ADMIN_PRODUCT_LIST,
      element: <ProductPage />,
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
      path: "update-produitemct",
      element: <EditProductForm />,
    },
    {
      path: "order-list",
      element: <OrdersPage />,
    },
    {
      path: "order-detail",
      element: <OrderDetailPage />,
    },
    // {
    //   path: "product-detail",
    //   element: <ProductDetail />,
    // },
    {
      path: "category-type-list",
      element: <CategoryTypePage />,
    },
    {
      path: "category-list",
      element: <CategoryPage />,
    },
    { path: "inventory-management", element: <InventoryManagement /> },

    {
      path: "/admin/product/edit/:id",
      element: <AddProductForm/>,
    },
    { path: "/admin/dashboard", 
      element: <DashboardHome />, 
    },
    {
      path: ROUTE_CONSTANTS.ADMIN_CHAT,
      element: <AdminChat />,
    }
  ],
};
