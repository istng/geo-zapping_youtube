import { useAuthQuery } from '../hooks/useAuthQuery';
import { Navigate } from '@tanstack/react-router';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, data: isAuthenticated } = useAuthQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};