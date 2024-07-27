import React from "react";
import ReactDOM from "react-dom";
import Layout from "./components/Layout";
import "./style.scss";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./common/store/store";
import { Provider } from "react-redux";
import axios from 'axios';

axios.defaults.baseURL = JSON.parse(window.CONFIGS).apiBase;
axios.defaults.headers.post['Content-Type'] = 'application/json';

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