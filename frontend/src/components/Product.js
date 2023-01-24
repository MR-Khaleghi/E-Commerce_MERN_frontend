import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Rating from './Rating';
import axios from 'axios';
import Row from 'react-bootstrap/esm/Row';
import { base_URL } from '../App';
import { useSelector, useDispatch } from 'react-redux';
import { CART_ADD_ITEM } from '../store/cartSlice';
function Product(props) {
  const { product } = props;
  console.log(product);
  // console.log(product.seller.seller.name);
  const dispatch = useDispatch();
  const { cart : {cartItems}} = useSelector(state => state.cart);
  

 
  

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(base_URL+`/api/products/${item._id}`);

    if (data.countInStock < quantity) {
      window.alert('Sorry. product is out stock');
      return;
    }
    dispatch(CART_ADD_ITEM({ ...item, quantity }));
    
  };

  return product ? (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={base_URL+product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Row>
          <Card.Text>${product.price}</Card.Text>
          <div>
            <Link to={`/seller/${product.seller._id}`}>
              {product.seller.seller.name}
            </Link>
          </div>
        </Row>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Add to Cart</Button>
        )}
      </Card.Body>
    </Card>
  ) : (
    <h1>No product</h1>
  );
}
export default Product;
