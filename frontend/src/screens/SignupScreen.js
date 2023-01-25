import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { base_URL } from '../App';
import { Store } from '../Store';
import { USER_SIGNIN } from '../store/userSlice';
import { getError } from '../utils';

export default function SignupScreen() {
  const navigate = useNavigate();
  // const { search } = useLocation();
  // console.log(search);
  // const redirectInUrl = new URLSearchParams(search).get('redirect');
  // console.log(redirectInUrl);
  // const redirect = redirectInUrl ? redirectInUrl : '/';
  const redirect = '/';
  console.log(redirect);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSeller, setIsSeller] = useState(false);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userInfo);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    try {
      console.log('fired');
      const { data } = await axios.post(base_URL + '/api/users/signup', {
        name,
        email,
        password,
        isSeller,
      });
      dispatch(USER_SIGNIN(data));
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
      console.log(data);
    } catch (err) {
      toast.error(getError(err));
      // alert('Invalid Email or password!');
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    } else navigate(`/signup`);
  }, [userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3"> Sing Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control required onChange={(e) => setName(e.target.value)} />
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
        <Form.Check
          type="switch"
          id="isSeller-checkbox"
          label="Are you a Seller?"
          onChange={() => setIsSeller(!isSeller)}
        />
        <br />
        <div className="mb-3">
          <Button variant="primary" type="submit">
            Sign Up
          </Button>
        </div>
        <div className="mb-3">
          Already have an account?{' '}
          {/* <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link> */}
          <Link to={`/signin`}>Sign-In</Link>
        </div>
      </Form>
    </Container>
  );
}
