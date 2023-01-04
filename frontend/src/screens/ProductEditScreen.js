import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

function reducerUpdateProduct(state, action) {
  switch (action.type) {
    case 'Update_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'Update_SUCCESS':
      return {
        ...state,
        loadingUpdate: false,
        productUpdate: action.payload,
        errorUpdate: '',
      };
    case 'Update_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    default:
      return state;
  }
}

function reducerUploadImage(state, action) {
  switch (action.type) {
    case 'Upload_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'Upload_SUCCESS':
      return {
        loadingUpload: false,
        imageUpload: action.payload,
        errorUpload: '',
      };
    case 'Upload_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
}
let updateSuccessFlag = false;

export default function ProductEditScreen() {
  let uploadSuccessFlag = false;
  let updateSuccessFlag = false;
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    if (!product) {
      // loadfrom backend
      const fetchData = async () => {
        dispatch({ type: 'FETCH_START' });
        try {
          const result = await axios.get(`/api/products/${id}`);
          // console.log(result);
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
          //   console.log(result.data);
          console.log('fired');
        } catch (err) {
          //   console.log(err);
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        }
      };
      fetchData();
    } else if (!loading) {
      console.log('loading setname');
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setBrand(product.brand);
      setDescription(product.description);
    } else {
      return;
    }
  }, [product]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [{ loadingUpdate, errorUpdate, productUpdate }, updateDispatch] =
    useReducer(reducerUpdateProduct, {
      loadingUpdate: false,
      errorUpdate: '',
    });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      updateDispatch({ type: 'Update_REQUEST' });
      const { data } = await axios.put(
        `/api/products/${product._id}`,
        {
          _id: id,
          name,
          price,
          image,
          category,
          brand,
          countInStock,
          description,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      updateDispatch({ type: 'Update_SUCCESS', payload: data.product });
      updateSuccessFlag = true;
      //   console.log(data.product);
      navigate('/admin/productlist');
    } catch (err) {
      updateDispatch({ type: 'Update_FAIL', payload: getError(err) });
    }
  };

  const [{ loadingUpload, errorUpload, imageUpload }, uploadDispatch] =
    useReducer(reducerUploadImage, {
      loadingUpload: false,
      errorUpload: '',
    });
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);

    try {
      uploadDispatch({ type: 'Upload_REQUEST' });

      const { data } = await axios.post(`/api/uploads/`, bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      uploadDispatch({ type: 'Upload_SUCCESS', payload: data });
      uploadSuccessFlag = true;
      //   console.log(data);
      setImage(data);
      //   console.log(typeof data);
      console.log(image);
    } catch (err) {
      uploadDispatch({ type: 'Upload_FAIL', payload: getError(err) });
    }
  };
  console.log(image);

  //   if (uploadSuccessFlag) {
  //     console.log('set Image');
  //     setImage(imageUpload);
  //   }

  return (
    <div>
      {loadingUpdate && <LoadingBox></LoadingBox>}
      {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
      {updateSuccessFlag && (
        <MessageBox variant="success">{`${productUpdate.name} Deleted Successfully.`}</MessageBox>
      )}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <div>
          <MessageBox variant="danger">{error}</MessageBox>
        </div>
      ) : (
        <div>
          <Container className="small-container">
            <Helmet>
              <title>Edit Product</title>
            </Helmet>
            <h1 className="my-3"> Edit Product</h1>
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  value={price}
                  type="text"
                  required
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="image">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  value={image}
                  type="text"
                  placeholder="Enter Image"
                  required
                  onChange={(e) => setImage(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="imageFile">
                <Form.Label>Image File</Form.Label>
                <Form.Control
                  type="file"
                  //   id="imageFile"
                  label="Choose Image"
                  onChange={uploadFileHandler}
                />
                {loadingUpload && <LoadingBox></LoadingBox>}
                {errorUpload && (
                  <MessageBox variant="danger">{errorUpload}</MessageBox>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  value={category}
                  type="text"
                  required
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="brand">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  value={brand}
                  type="text"
                  required
                  onChange={(e) => setBrand(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="countInStock">
                <Form.Label>CountInStock</Form.Label>
                <Form.Control
                  value={countInStock}
                  type="text"
                  required
                  onChange={(e) => setCountInStock(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  value={description}
                  type="text"
                  required
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
              <div className="mb-3">
                <Button variant="primary" type="submit">
                  Update
                </Button>
              </div>
            </Form>
          </Container>
        </div>
      )}
    </div>
  );
}
