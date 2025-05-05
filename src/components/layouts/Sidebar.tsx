
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  ClipboardCheck, 
  Home, 
  User, 
  UserPlus, 
  Users, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/lib/hooks';
import { logoutUser } from '@/store/auth/authSlice';
import { useIsMobile } from '@/hooks/use-mobile';

export function Sidebar({ isMobileMenuOpen = false }) {
  const location = useLocation();
  const { isAdmin, isManager } = useAuth();
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, allowedRoles: ['Admin', 'Manager', 'Employee'] },
    { name: 'Evaluations', href: '/evaluations', icon: ClipboardCheck, allowedRoles: ['Admin', 'Manager'] },
    { name: 'Reports', href: '/reports', icon: BarChart3, allowedRoles: ['Admin', 'Manager'] },
    { name: 'My Profile', href: '/profile', icon: User, allowedRoles: ['Admin', 'Manager', 'Employee'] },
    { name: 'Employees', href: '/employees', icon: Users, allowedRoles: ['Admin'] },
    { name: 'Register User', href: '/register', icon: UserPlus, allowedRoles: ['Admin'] },    
  ];

  
  if (isMobile && !isMobileMenuOpen) {
    return null;
  }

  const sidebarClasses = isMobile
    ? "fixed inset-0 z-50 bg-white w-full h-full overflow-y-auto"
    : "hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen";

  return (
    <div className={sidebarClasses}>
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-primary-blue">NOLATEC 360°</h1>
      </div>
      <div className="flex flex-col justify-between flex-1 overflow-y-auto">
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            {links.map((link) => {
              
              if ((isAdmin && link.allowedRoles.includes('Admin')) || 
                  (isManager && link.allowedRoles.includes('Manager')) || 
                  (!isAdmin && !isManager && link.allowedRoles.includes('Employee'))) {
                return (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className={cn(
                        'flex items-center px-4 py-3 text-sm font-medium rounded-md group',
                        location.pathname === link.href
                          ? 'bg-primary-blue text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      <link.icon className={cn('h-5 w-5 mr-3', location.pathname === link.href ? 'text-white' : 'text-gray-500')} />
                      {link.name}
                    </Link>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-700 hover:bg-gray-100"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3 text-gray-500" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
