import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './store/cartSlice'
import userReducer from './store/userSlice'

export  const Store = configureStore({
    reducer: {
        cart: cartReducer,
        userInfo: userReducer
    }
});
