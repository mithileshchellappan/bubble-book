import { Navigate, useLocation } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { accounts } = useMsal();
  const location = useLocation();
  
  if (!accounts.length) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}; 