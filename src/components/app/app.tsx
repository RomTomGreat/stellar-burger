import '../../index.css';
import styles from './app.module.css';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { getCookie, deleteCookie } from '../../utils/cookie';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';
import {
  fetchFeeds,
  fetchGetUser,
  fetchIngredients,
  init,
  selectIngredients,
  selectIsAutorization,
  selectOrders
} from '../../services/slices/stellar-burgerSlice';

const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const token = getCookie('accessToken');
  const backgroundLocation = location.state?.backgroundLocation;
  const isAutorization = useAppSelector(selectIsAutorization);
  const ingredients = useAppSelector(selectIngredients);
  const feeds = useAppSelector(selectOrders);

  useEffect(() => {
    if (!isAutorization && token) {
      dispatch(fetchGetUser())
        .unwrap()
        .then(() => {
          dispatch(init());
        })
        .catch(() => {
          deleteCookie('accessToken');
          localStorage.removeItem('refreshToken');
        });
    } else {
      dispatch(init());
    }
  }, []);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, []);

  useEffect(() => {
    if (!feeds.length) {
      dispatch(fetchFeeds());
    }
  }, []);

  const closeModal = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='*' element={<NotFound404 />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Modal
              title={'Детали ингридиентов'}
              onClose={() => {
                dispatch(closeModal);
              }}
            >
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path='/feed/:number'
          element={
            <Modal
              title={'Информация о заказе'}
              onClose={() => {
                dispatch(closeModal);
              }}
            >
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <Modal
              title={'Информация о заказе'}
              onClose={() => {
                dispatch(closeModal);
              }}
            >
              <ProtectedRoute>
                <OrderInfo />
              </ProtectedRoute>
            </Modal>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
