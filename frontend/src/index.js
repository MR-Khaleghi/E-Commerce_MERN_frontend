import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';
import {Provider} from 'react-redux';
import {Store} from "./Store";

// ReactDOM.render(
// //   <React.StrictMode>

// //   </React.StrictMode>
// , document.querySelector('#root'));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store = {Store}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);
