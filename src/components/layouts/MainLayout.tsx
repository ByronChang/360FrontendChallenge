
import { ReactNode, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: Array<'Admin' | 'Manager' | 'Employee'>;
}

export function MainLayout({ children, requireAuth = true, allowedRoles }: MainLayoutProps) {
  const { isAuthenticated, user } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    
    const authCheckTimer = setTimeout(() => {
      setIsAuthChecking(false);
    }, 500);

    return () => clearTimeout(authCheckTimer);
  }, []);

  
  if (isAuthChecking) {
    return <div className="flex h-screen items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  if (requireAuth && !isAuthenticated) {    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAuthenticated && allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {!isMobile && <Sidebar />}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="professional-layout">{children}</div>
        </main>
      </div>
    </div>
  );
}
