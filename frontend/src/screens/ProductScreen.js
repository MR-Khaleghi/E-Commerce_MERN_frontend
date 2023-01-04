import axios from 'axios';
import { useContext, useEffect, useReducer, useState } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Rating from '../components/Rating';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import { toast } from 'react-toastify';

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

const reviewReducer = (state, action) => {
  switch (action.type) {
    case 'REVIEW_START':
      return { ...state, loadingReview: true };
    case 'REVIEW_SUCCESS':
      return { ...state, review: action.payload, loadingReview: false };
    case 'REVIEW_FAIL':
      return { ...state, errorReview: action.payload, loadingReview: false };

    default:
      return state;
  }
};

let reviewSuccessFlag = false;

function ProductScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_START' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        // console.log(result);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        // setProducts(result.data);
        // console.log(products);
      } catch (err) {
        console.log(err);
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. product is out stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart');
  };

  const [{ loadingReview, errorReview, review }, reviewDispatch] = useReducer(
    reviewReducer,
    {
      review: {},
      loadingReview: false,
      errorReview: '',
    }
  );
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  // console.log(userInfo);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (comment && rating) {
      // console.log(review);
      try {
        reviewDispatch({ type: 'REVIEW_START' });
        const { data } = await axios.post(
          `/api/products/${product._id}/reviews`,
          { rating, comment, name: userInfo.name }, // review
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        reviewDispatch({ type: 'REVIEW_SUCCESS', payload: data });
        reviewSuccessFlag = true;
        setRating('');
        setComment('');
        // toast.error(`toast Review Successfully.`);
        // console.log(data);
        // console.log(review);
      } catch (err) {
        reviewDispatch({ type: 'REVIEW_FAIL', payload: getError(err) });
      }
    } else {
      alert('please enter comment and rating');
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
      <Row>
        <Col md={6}>
          <img className="img-large" src={product.image} alt={product.name} />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card var>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Col>Seller:</Col>
                  <h4>
                    <Link to={`/seller/${product.seller._id}`}>
                      {product.seller.seller.name}
                    </Link>
                  </h4>
                  <Rating
                    rating={product.seller.seller.rating}
                    numReviews={product.seller.seller.numReviews}
                  ></Rating>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Add To Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <div>
          <h2 id="reviews">Reviews</h2>
          {product.reviews.length === 0 && (
            <MessageBox>There is no review</MessageBox>
          )}
          <ul>
            {product.reviews.map((review) => (
              <li key={review._id}>
                <strong>{review.name}</strong>
                <Rating rating={review.rating} caption=" "></Rating>
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </li>
            ))}
            <li>
              {userInfo ? (
                <Form onSubmit={submitHandler}>
                  <Form.Label>Write a customer review</Form.Label>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Rating</Form.Label>
                    <select
                      id="rating"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option value="1">1- Poor</option>
                      <option value="2">2- Fair</option>
                      <option value="3">3- Good</option>
                      <option value="4">4- Very good</option>
                      <option value="5">5- Excelent</option>
                    </select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      value={comment}
                      required
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                  {loadingReview && <LoadingBox></LoadingBox>}
                  {errorReview && (
                    <MessageBox variant="danger">{errorReview}</MessageBox>
                  )}
                  {reviewSuccessFlag && (
                    <MessageBox variant="success">{`${comment} review sent Successfully.`}</MessageBox>
                  )}
                </Form>
              ) : (
                <MessageBox>
                  Please <Link to="/signin">Sign In</Link> to write a review
                </MessageBox>
              )}
            </li>
          </ul>
        </div>
      </Row>
    </div>
  );
}
export default ProductScreen;
