import { useContext } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Col from 'react-bootstrap/esm/Col';
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';
import Row from 'react-bootstrap/esm/Row';
import Card from 'react-bootstrap/esm/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import axios from 'axios';
import { base_URL } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from '../store/cartSlice';

function CartScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    cart: { cartItems },
  } = useSelector((state) => state.cart);

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(base_URL + `/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. product is out stock');
      return;
    }
    dispatch(CART_ADD_ITEM({ ...item, quantity }));
  };

  const removeItemHandler = (item) => {
    dispatch(CART_REMOVE_ITEM(item));
  };

  const checkoutHandler = () => {
    navigate('/shipping');
    // navigate('/signin?redirect=/shipping');
  };

  return (
    <div>
      <Helmet>
        <title>test</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroupItem key={item._id}>
                  <Row>
                    <Col md={4}>
                      <img
                        className="img-fluid rounded img_thumbnail"
                        src={base_URL + item.image}
                        alt={item.name}></img>{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        variant="light"
                        disabled={item.quantity === 1}>
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        variant="light"
                        disabled={item.quantity === item.countInStock}>
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={3}>${item.price}</Col>
                    <Col md={2}>
                      <Button
                        onClick={() => removeItemHandler(item)}
                        variant="light">
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => c.quantity, 0)} items)
                    : ${' '}
                    {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div>
                    <Button
                      type="button"
                      onClick={checkoutHandler}
                      variant="primary"
                      disabled={cartItems.length === 0}>
                      Proceed To Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CartScreen;
