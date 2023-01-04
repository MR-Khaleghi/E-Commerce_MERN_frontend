import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../Store';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Rating from '../components/Rating';
import axios from 'axios';
import { getError } from '../utils';
import { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';

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

function reducerUser(state, action) {
  switch (action.type) {
    case 'USER_FETCH_REQUEST':
      return { ...state, loadingUser: true, errorUser: '' };
    case 'USER_FETCH_SUCCESS':
      return {
        ...state,
        loadingUser: false,
        user: action.payload,
        errorUser: '',
      };
    case 'USER_FETCH_FAIL':
      return { ...state, loadingUser: false, errorUser: action.payload };
    default:
      return state;
  }
}

export default function SellerScreen() {
  const params = useParams();
  const { id: sellerId } = params;
  // console.log(sellerId);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
  });

  const [{ loadingUser, errorUser, user }, dispatchSeller] = useReducer(
    reducerUser,
    {
      loadingUser: false,
      errorUser: '',
      user: {},
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      // console.log('product fired');
      dispatch({ type: 'FETCH_START' });
      try {
        const result = await axios.get(`/api/products?seller=${sellerId}`);
        // console.log(result);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        // console.log(result.data);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // console.log('user fired');
        dispatchSeller({ type: 'USER_FETCH_REQUEST' });
        const { data } = await axios.get(`/api/users/${sellerId}`, {});
        dispatchSeller({ type: 'USER_FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatchSeller({ type: 'USER_FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchUsers();
  }, [userInfo, sellerId]);
  return (
    <div>
      <Helmet>
        <title>Seller Information</title>
      </Helmet>
      <h1>Seller Information</h1>

      {loadingUser ? (
        <LoadingBox />
      ) : errorUser ? (
        <MessageBox variant="danger">{errorUser}</MessageBox>
      ) : !user.seller ? (
        <LoadingBox />
      ) : (
        <div>
          <Row>
            <Col md={3}>
              <Card>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <img
                            className="small-seller"
                            src={user.seller.logo}
                            alt={user.seller.name}
                          ></img>
                        </Col>
                        <Col className="start">
                          <h4>{user.seller.name}</h4>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Rating
                        rating={user.seller.rating}
                        numReviews={user.seller.numReviews}
                      ></Rating>
                    </ListGroup.Item>
                    <ListGroup.Item>{user.seller.description}</ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col md={9}>
              {loading ? (
                <LoadingBox />
              ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
              ) : (
                <div>
                  {!products && <MessageBox>No product found!</MessageBox>}
                  <Row>
                    {products &&
                      products.map((product, index) => (
                        <Col sm={6} md={4} lg={3} className="mb-3" key={index}>
                          <Product product={product} index={index}></Product>
                        </Col>
                      ))}
                  </Row>
                </div>
              )}
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
