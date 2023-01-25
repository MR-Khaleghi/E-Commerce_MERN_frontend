import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import HomeScreen from './screens/HomeScreen';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProductScreen from './screens/ProductScreen';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useEffect, useState } from 'react';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';

import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import DashboardScreen from './screens/DashboardScreen';
import UserListScreen from './screens/UserListScreen';
import SellerRoute from './components/SellerRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import SellerScreen from './screens/SellerScreen';
import { useSelector } from 'react-redux';
import NavBar from './components/Navbar';

const dev = false;
export const base_URL = dev
  ? 'http://localhost:10000'
  : `https://ecommerce-mern-backend.onrender.com`;

function App() {
  const { userInfo } = useSelector((state) => state.userInfo);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  // console.log(userInfo);
  if (!userInfo) {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('cartItems');
  }

  const sidebarCallback = (sidebarIsOpen) => {
    setSidebarIsOpen(sidebarIsOpen);
  };

  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }>
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <NavBar sidebarOnclick={sidebarCallback} />
        </header>

        {/* NavBar */}

        <main>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/shipping" element={<ShippingAddressScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/payment" element={<PaymentMethodScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route
              path="/product/:id/edit"
              element={<ProductEditScreen />}
              exact
            />
            <Route path="/seller/:id" element={<SellerScreen />} exact />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <OrderScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orderhistory"
              element={
                <ProtectedRoute>
                  <OrderHistoryScreen />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>
              }
            />
            <Route path="/search" element={<SearchScreen />} />
            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <DashboardScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/userlist"
              element={
                <AdminRoute>
                  <UserListScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/productlist"
              element={
                <AdminRoute>
                  <ProductListScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orderlist"
              element={
                <AdminRoute>
                  <OrderListScreen />
                </AdminRoute>
              }
            />
            {/* Seller Routes */}

            <Route
              path="/productlist/seller"
              element={
                <SellerRoute>
                  <ProductListScreen />
                </SellerRoute>
              }
            />
            <Route
              path="/orderlist/seller"
              element={
                <SellerRoute>
                  <OrderListScreen />
                </SellerRoute>
              }
            />
          </Routes>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
