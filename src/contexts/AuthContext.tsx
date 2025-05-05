
import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setUser, User, clearUser } from '@/store/auth/authSlice';
import { jwtDecode } from 'jwt-decode';
import { api } from '@/lib/axios';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isEmployee: boolean;
}


interface CustomJwtPayload {
  sub?: string;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: unknown;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  isAdmin: false,
  isManager: false,
  isEmployee: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, token, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      try {

        const decoded = jwtDecode<CustomJwtPayload>(storedToken);
        

        if (decoded && typeof decoded === 'object' && decoded.email && decoded.role) {

          const roleStr = decoded.role as string;
          const capitalizedRole = roleStr.charAt(0).toUpperCase() + roleStr.slice(1).toLowerCase();
          

          const userData: User = {
            id: decoded.sub as string || '',
            email: decoded.email as string || '',
            name: (decoded.name as string || decoded.email as string) || '',
            role: capitalizedRole as User['role'],
          };
          
          dispatch(setUser({ user: userData, token: storedToken }));
        } else {
          console.error('Token does not contain expected user information');
          localStorage.removeItem('token');
          dispatch(clearUser());
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        dispatch(clearUser());
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'Admin';
  const isManager = user?.role === 'Manager';
  const isEmployee = user?.role === 'Employee';

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated, isAdmin, isManager, isEmployee }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
