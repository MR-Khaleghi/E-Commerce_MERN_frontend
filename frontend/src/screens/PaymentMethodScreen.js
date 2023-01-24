import Form from 'react-bootstrap/Form';
// import Form from 'react-bootstrap/Form';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import CheckoutSteps from '../components/CheckoutSteps';
import Button from 'react-bootstrap/esm/Button';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SAVE_PAYMENT_METHOD } from '../store/cartSlice';

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart: { shippingAddress, paymentMethod }} = useSelector(state => state.cart);

  
  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
  );
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(SAVE_PAYMENT_METHOD( paymentMethodName ));
    localStorage.setItem('paymentMethod', JSON.stringify(paymentMethodName));
    navigate('/placeorder');
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <Helmet>
        <title>Payment Method</title>
      </Helmet>
      <h1 className="my-3">Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <div className="mb-3">
          <Form.Check
            type="radio"
            id="PayPal"
            label="PayPal"
            value="PayPal"
            checked={paymentMethodName === 'PayPal'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <Form.Check
            type="radio"
            id="Stripe"
            label="Stripe"
            value="Stripe"
            checked={paymentMethodName === 'Stripe'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </div>
        <Button variant="primary" type="submit">
          Continue
        </Button>
      </Form>
    </div>
  );
}
