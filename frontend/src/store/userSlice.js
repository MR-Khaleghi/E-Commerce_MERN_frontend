import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    USER_SIGNIN(state, action) {
      state.userInfo = action.payload;
    },

    USER_SIGNOUT(state, action) {
      state.userInfo = null;
      state.cart = { cartItems: [], shippingAddress: {}, paymentMethod: '' };
    },
  },
});
export const { USER_SIGNIN, USER_SIGNOUT } = userSlice.actions;
export default userSlice.reducer;
