import React from "react";
import ReactDOM from "react-dom";
import Layout from "./components/Layout";
import "./style.scss";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./common/store/store";
import { Provider } from "react-redux";
import axios from 'axios';

axios.defaults.baseURL = 'https://api-gateway.suncoast.systems';
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.request.use(request => {
  // console.log(request);
  // Edit request config
  return request;
}, error => {
  try {
  axios.post('/nodejs-cloudflare-logging-service', 
    { 
        "severity": "ERROR",
        "payload":{
            error
        }
    })
  } catch (error) {
    console.log(error);
  }
});

axios.interceptors.response.use(response => {
  // console.log(response);
  // Edit response config
  return response;
}, error => {
  try {
    axios.post('/nodejs-cloudflare-logging-service', 
      { 
          "severity": "ERROR",
          "payload":{
              error
          }
      })
    } catch (error) {
      console.log(error);
    }
});

function renderToDOM() {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Layout />
        </PersistGate>
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );
}

renderToDOM();
export { renderToDOM };