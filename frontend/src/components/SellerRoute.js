import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Store } from '../Store';

export default function SellerRoute({ children }) {
  const {  userInfo } = useSelector(state => state.userInfo);
  return userInfo && userInfo.isSeller ? children : <Navigate to="/signin" />;
}
