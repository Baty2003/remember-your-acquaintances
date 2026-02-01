import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '../../components';
import { useAppSelector } from '../../hooks';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={styles.container}>
      <AuthForm />
    </div>
  );
};
