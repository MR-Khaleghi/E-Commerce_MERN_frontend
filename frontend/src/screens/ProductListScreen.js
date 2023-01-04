import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/esm/Button';
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
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function reducerDeleteUser(state, action) {
  switch (action.type) {
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, errorDelete: '' };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        productDelete: action.payload,
        errorDelete: '',
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, errorDelete: action.payload };
    default:
      return state;
  }
}

function reducerCreateProduct(state, action) {
  switch (action.type) {
    case 'Create_REQUEST':
      return { ...state, loadingCreate: true, errorCreate: '' };
    case 'Create_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
        productCreate: action.payload,
        errorCreate: '',
      };
    case 'Create_FAIL':
      return { ...state, loadingCreate: false, errorCreate: action.payload };
    default:
      return state;
  }
}

function reducerDeleteProduct(state, action) {
  switch (action.type) {
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, errorDelete: '' };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        productDelete: action.payload,
        errorDelete: '',
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, errorDelete: action.payload };
    default:
      return state;
  }
}

export default function ProductListScreen(props) {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    products: [],
  });
  const [{ loadingDelete, errorDelete, productDelete }, deleteDispatch] =
    useReducer(reducerDeleteProduct, {
      loadingDelete: false,
      errorDelete: '',
      productDelete: null,
    });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const seller = userInfo._id;
        const { data } = await axios.get(`/api/products?seller=${seller}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        // console.log(data);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchProducts();
  }, [dispatch, productDelete]);

  const [{ loadingCreate, errorCreate, productCreate }, createDispatch] =
    useReducer(reducerCreateProduct, {
      loadingCreate: false,
      errorCreate: '',
    });

  const createHandler = async (product) => {
    try {
      createDispatch({ type: 'Create_REQUEST' });
      const { data } = await axios.post(
        `/api/products`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      createDispatch({ type: 'Create_SUCCESS', payload: data.product });
      //   console.log(data.product);
      navigate(`/product/${data.product._id}/edit`);
    } catch (err) {
      createDispatch({ type: 'Create_FAIL', payload: getError(err) });
    }
  };

  const deleteHandler = async (product) => {
    if (window.confirm('Are you sure?')) {
      try {
        deleteDispatch({ type: 'DELETE_REQUEST' });
        const { data } = await axios.delete(`/api/products/${product._id}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        deleteDispatch({ type: 'DELETE_SUCCESS', payload: data });
        //   toast.error(`toast Deleted Successfully.`);
        // console.log(data);
        // console.log(productDelete.user.name);
      } catch (err) {
        deleteDispatch({ type: 'DELETE_FAIL', payload: getError(err) });
      }
    }
  };

  return loading ? (
    <div>
      <LoadingBox />
    </div>
  ) : error ? (
    <div>
      <MessageBox variant="danger">{error}</MessageBox>
    </div>
  ) : (
    <div>
      <h1>Products</h1>
      <Button
        // id="create-product-Button"
        type="button"
        className="float-end"
        onClick={createHandler}
      >
        Create Product
      </Button>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.category}</td>
              <td>{product.brand}</td>
              <td>
                <button
                  type="button"
                  className="small"
                  onClick={() => navigate(`/product/${product._id}/edit`)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="small"
                  onClick={() => deleteHandler(product)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
