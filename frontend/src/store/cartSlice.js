


// const initialState = {
//   posts: [],
//   status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
//   error: null
// }

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
      itemsPrice : 0,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: 0,

  },
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
 
};


const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    CART_ADD_ITEM:{
          reducer(state, action) {
              // add to cart
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
        state.cart.cartItems = cartItems;
          },
          
      },
      CART_REMOVE_ITEM(state, action){
        const removeItem = action.payload;
        const cartItems = state.cart.cartItems.filter(
          (item) => item._id !== removeItem._id
        );
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        state.cart.cartItems= cartItems;
      },
      CART_CLEAR(state, action) {
        state.cart.cartItems = [];
        localStorage.setItem('cartItems', JSON.stringify([]));
      },
      SAVE_SHIPPING_ADDRESS(state, action) {
        state.cart.shippingAddress= action.payload;
      },
      SAVE_PAYMENT_METHOD(state, action) {
        state.cart.paymentMethod= action.payload;


      },

    }
  });
  export const {CART_ADD_ITEM, CART_REMOVE_ITEM, CART_CLEAR, SAVE_SHIPPING_ADDRESS, SAVE_PAYMENT_METHOD } = cartSlice.actions;
  export default cartSlice.reducer;
