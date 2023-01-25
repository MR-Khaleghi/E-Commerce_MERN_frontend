import { Link, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import Badge from 'react-bootstrap/esm/Badge';
import Button from 'react-bootstrap/esm/Button';
import SearchBox from '../screens/SearchBox';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { USER_SIGNOUT } from '../store/userSlice';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import axios from 'axios';
import { base_URL } from '../App';

const NavBar = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.userInfo);

  const sidebarHandler = () => {
    setSidebarIsOpen(!sidebarIsOpen);
    props.sidebarOnclick(sidebarIsOpen);
  };

  const signoutHandler = () => {
    console.log('signout fired');

    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    dispatch(USER_SIGNOUT);
    // navigate('/signin', { replace: true });
    // window.location.href('/signin');
    // navigate('/signin', { replace: true });
  };
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // console.log( base_URL+`/api/products/categories`);
        const { data } = await axios.get(base_URL + `/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          {/* sidebar button*/}
          <Button variant="dark" onClick={sidebarHandler}>
            <i className="fas fa-bars"></i>
          </Button>

          <LinkContainer to="/">
            <Navbar.Brand>Online Shop</Navbar.Brand>
          </LinkContainer>
          {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}

          <Navbar.Collapse id="basic-navbar-nav ">
            <SearchBox />
            <Nav className="me-auto w-100 justify-content-end">
              <Link to="/cart" className="nav-link">
                Cart
                {cart.cartItems.length > 0 && (
                  <Badge pill bg="danger">
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </Badge>
                )}
              </Link>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>User Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/orderhistory">
                    <NavDropdown.Item>Order History</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <a
                    href="/"
                    className="dropdown-item"
                    onClick={signoutHandler}>
                    Sign Out
                  </a>
                </NavDropdown>
              ) : (
                <Link to="/signin" className="nav-link">
                  Sign In
                </Link>
              )}
              {userInfo && userInfo.isSeller && (
                <NavDropdown title="seller" id="seller-nav-dropdown">
                  <LinkContainer to="/productlist/seller">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/orderlist/seller">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="admin" id="admin-nav-dropdown">
                  <LinkContainer to="/admin/dashboard">
                    <NavDropdown.Item>Dashboard</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div
        className={
          sidebarIsOpen
            ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
            : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
        }>
        <Nav className="flex-column text-white w-100 p-2">
          <Nav.Item>
            <strong>Categories</strong>
          </Nav.Item>
          {categories.map((category) => (
            <Nav.Item key={category}>
              <LinkContainer
                // to={`/search?category=${category}`}
                to={{
                  pathname: '/search',
                  search: `?category=${category}`,
                  hash: '',
                }}
                onClick={() => setSidebarIsOpen(false)}>
                <Nav.Link>{category}</Nav.Link>
              </LinkContainer>
            </Nav.Item>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default NavBar;
