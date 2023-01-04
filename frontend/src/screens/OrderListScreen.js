import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function reducerDeleteOrder(state, action) {
  switch (action.type) {
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, errorDelete: '' };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        orderDelete: action.payload,
        errorDelete: '',
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, errorDelete: action.payload };
    default:
      return state;
  }
}

export default function OrderListScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });
  const [{ loadingDelete, errorDelete, orderDelete }, deleteDispatch] =
    useReducer(reducerDeleteOrder, {
      loadingDelete: false,
      errorDelete: '',
      orderDelete: null,
    });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (!userInfo) {
      navigate('/signin');
    }

    fetchOrder();
  }, [dispatch, orderDelete]);

  const deleteHandler = async (order) => {
    if (window.confirm('Are you sure?')) {
      try {
        deleteDispatch({ type: 'DELETE_REQUEST' });
        const { data } = await axios.delete(`/api/orders/${order._id}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        deleteDispatch({ type: 'DELETE_SUCCESS', payload: data });
        //   toast.error(`toast Deleted Successfully.`);
        // console.log(data);
        // console.log(orderDelete.user.name);
      } catch (err) {
        deleteDispatch({ type: 'DELETE_FAIL', payload: getError(err) });
      }
    }
  };

  return (
    <div>
      <Helmet>
        <title>Orders History</title>
      </Helmet>
      <h1>Orders History</h1>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User Name</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAT.substring(0, 10) : 'No'}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAT.substring(0, 10)
                    : 'No'}
                </td>
                <td>
                  <Button
                    type="button"
                    className="small"
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    Details
                  </Button>
                  <Button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(order)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
