import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, error: '' };
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        loadingUpdate: false,
        order: action.payload,
        error: '',
      };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, error: action.payload };
    default:
      return state;
  }
}

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerLogo, setSellerLogo] = useState('');
  const [sellerDescription, setSellerDescription] = useState('');
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  useEffect(() => {
    if (userInfo.seller) {
      setSellerName(userInfo.seller.name);
      setSellerLogo(userInfo.seller.logo);
      setSellerDescription(userInfo.seller.description);
    }
  }, [userInfo]);
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      const { data } = await axios.put(
        `/api/users/profile`,
        { name, email, password, sellerName, sellerLogo, sellerDescription },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL' });
      toast.error(getError(err));
    }
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1>User Profile</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div>
          {userInfo.isSeller && (
            <>
              <h2>Seller</h2>
              <Form.Group className="mb-3" controlId="sellerName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  value={sellerName}
                  required
                  onChange={(e) => setSellerName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="sellerLogo">
                <Form.Label>sellerLogo</Form.Label>
                <Form.Control
                  value={sellerLogo}
                  required
                  onChange={(e) => setSellerLogo(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="sellerDescription">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  value={sellerDescription}
                  required
                  onChange={(e) => setSellerDescription(e.target.value)}
                />
              </Form.Group>
            </>
          )}
        </div>
        <div className="mb-3">
          <Button type="submit">Update</Button>
        </div>
      </Form>
    </div>
  );
}
