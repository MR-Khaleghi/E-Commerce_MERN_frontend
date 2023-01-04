import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Store } from '../Store';

export default function ProtectedRoute({ children }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  return userInfo ? children : <Navigate to="/signin" />;
}
