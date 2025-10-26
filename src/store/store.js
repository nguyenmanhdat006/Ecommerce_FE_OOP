import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productReducer from "./features/product";
import cartReducer from "./features/cart";
import categoryReducer from "./features/category";
import commonReducer from "./features/common";
import userReducer from "./features/user";
import productSlice from "./productSlice";
import authSlice from "./authSlice";
import resourceSlice from "./resourceSlice";
import uploadSlice from "./uploadSlice";
import categorySlice from "./categorySlice";

const rootReducer = combineReducers({
  productState: productReducer,
  cartState: cartReducer,
  categoryState: categoryReducer,
  commonState: commonReducer,
  userState: userReducer,
  productSlice: productSlice,
  authSlice: authSlice,
  resourceSlice: resourceSlice,
  uploadSlice: uploadSlice,
  categorySlice: categorySlice,

});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
