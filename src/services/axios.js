import axios from "axios";
import { toggleLoading } from "../store/features/LoadingSlice";

let store;

export const injectStore = (_store) => {
  store = _store;
};

const API = axios.create();
const OmdbAPI = axios.create();

API.interceptors.request.use(
  (config) => {
    const token = store?.getState()?.auth?.accessToken;
    config.baseURL = "/api/v1";
    config.headers.authorization = `Bearer ${token}`;
    store.dispatch(toggleLoading());
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    store.dispatch(toggleLoading());
    return response;
  },
  async (error) => {
    store.dispatch(toggleLoading());
    return API(error.config);
  }
);
//---------------------------------------

OmdbAPI.interceptors.request.use(
  (config) => {
    config.baseURL = "/omdb";

    config.params = {
      apiKey: process.env.REACT_APP_API_KEY,
      ...config.params,
    };

    store.dispatch(toggleLoading());
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

OmdbAPI.interceptors.response.use(
  (response) => {
    store.dispatch(toggleLoading());
    return response;
  },
  async (error) => {
    store.dispatch(toggleLoading());
    return API(error.config);
  }
);

export { OmdbAPI, API };
