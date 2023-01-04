import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, users: action.payload, error: '' };
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
        userDelete: action.payload,
        errorDelete: '',
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, errorDelete: action.payload };
    default:
      return state;
  }
}

export default function UserListScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, users }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const [{ loadingDelete, errorDelete, userDelete }, deleteDispatch] =
    useReducer(reducerDeleteUser, {
      loadingDelete: false,
      errorDelete: '',
      userDelete: null,
    });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/users`, {
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

    fetchUsers();
  }, [userInfo, navigate, userDelete]);

  const deleteHandler = async (user) => {
    if (window.confirm('Are you sure?')) {
      try {
        deleteDispatch({ type: 'DELETE_REQUEST' });
        const { data } = await axios.delete(`/api/users/${user._id}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        deleteDispatch({ type: 'DELETE_SUCCESS', payload: data });
        //   toast.error(`toast Deleted Successfully.`);
        // console.log(data);
        // console.log(userDelete.user.name);
      } catch (err) {
        deleteDispatch({ type: 'DELETE_FAIL', payload: getError(err) });
      }
    }
  };
  //   console.log(userDelete);
  return (
    <div>
      <h1>Users</h1>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {userDelete !== null && (
        <MessageBox variant="success">{`${userDelete.user.name} Deleted Successfully.`}</MessageBox>
      )}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>IS SELLER</th>
              <th>IS ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isSeller ? 'Yes' : 'No'}</td>
                <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                <td>
                  <button type="button" className="small">
                    Edit
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(user)}
                  >
                    Delete
                  </button>
                </td>
                <td>{user._id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
