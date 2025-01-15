import api from './api';
import store from '../redux/store';
import { logoutUser } from '../features/auth/authSlice';

let isRefreshing = false;
let refreshSubscribers = [];

const processQueue = (error) => {
  refreshSubscribers.forEach((callback) => callback(error));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    if (
      error.response &&
      (error.response.status === 401 ||
        (error.response.status === 400 &&
          error.response.data.message?.errorCode === 'TOKEN_EXPIRED')) &&
      !originalConfig._retry &&
      !originalConfig.skipInterceptor
    ) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          await api.post('/user/refresh_token');

          processQueue(null);

          return api(originalConfig);
        } catch (refreshError) {
          store.dispatch(logoutUser());
          processQueue(refreshError);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        refreshSubscribers.push((error) => {
          if (error) {
            reject(error);
          } else {
            resolve(api(originalConfig));
          }
        });
      });
    }

    return Promise.reject(error);
  },
);
