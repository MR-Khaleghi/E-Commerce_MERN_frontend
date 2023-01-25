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
import { USER_SIGNIN } from '../store/userSlice';
import { getError } from '../utils';

export default function SigninScreen() {
  const navigate = useNavigate();
  // const { search } = useLocation();
  // console.log(search);
  // const redirectInUrl = new URLSearchParams(search).get('redirect');
  // console.log(redirectInUrl);
  // const redirect = redirectInUrl ? redirectInUrl : '/';
  const redirect = '/';
  console.log(redirect);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userInfo);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      console.log('fired');
      const { data } = await axios.post(base_URL + '/api/users/signin', {
        email,
        password,
      });
      dispatch(USER_SIGNIN(data));
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
      // console.log(data);
    } catch (err) {
      toast.error(getError(err));
      // alert('Invalid Email or password!');
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo]);
  if (userInfo) {
    navigate('/');
  } else {
    return (
      <Container className="small-container">
        <Helmet>
          <title>Sign In</title>
        </Helmet>
        <h1 className="my-3"> Sing In</h1>
        <Form onSubmit={submitHandler}>
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
          <div className="mb-3">
            <Button variant="primary" type="submit">
              Sign In
            </Button>
          </div>
          <div className="mb-3">
            New Customer?{' '}
            {/* <Link to={`/signup?redirect=${redirect}`}>Create your account</Link> */}
            <Link to={`/signup`}>Create your account</Link>
          </div>
        </Form>
      </Container>
    );
  }
}
