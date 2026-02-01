import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Spin } from 'antd';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchCurrentUser } from '../store/authSlice';
import { router } from '../router';
import styles from './App.module.css';

export const App = () => {
  const dispatch = useAppDispatch();
  const { token, isLoading, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If we have a token but no user, validate the token
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, user]);

  // Show loading while validating token
  if (token && !user && isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  return <RouterProvider router={router} />;
};
