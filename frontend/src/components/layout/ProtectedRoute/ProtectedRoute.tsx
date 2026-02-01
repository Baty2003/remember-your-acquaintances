import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../../hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Don't show spinner - just check if authenticated (token exists)
  // The token will be validated on API calls, and 401 will redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
