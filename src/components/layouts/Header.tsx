
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Bell, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppDispatch } from '@/lib/hooks';
import { Home, ClipboardCheck, BarChart3, Users, UserPlus, LogOut } from 'lucide-react';
import { logoutUser } from '@/store/auth/authSlice';
import { cn } from '@/lib/utils';

export function Header() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  
  const getUserInitial = () => {
    if (user?.name && typeof user.name === 'string' && user.name.length > 0) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email && typeof user.email === 'string' && user.email.length > 0) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="professional-layout h-16 flex items-center justify-between">
        <div className="flex items-center md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </Button>
        </div>

        <div className="hidden md:block">
          <h2 className="text-lg font-medium text-gray-800">
            Welcome, {user?.name || user?.email || 'User'}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary-blue ring-2 ring-white"></span>
          </Button>
          
          <Link to="/profile" className="flex items-center space-x-3">
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {user?.name || user?.email || 'User'}
            </span>
            <Avatar className="h-8 w-8 bg-primary-blue">
              <AvatarFallback>{getUserInitial()}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <aside className="md:hidden">
          {/* Render the sidebar with mobile menu open */}
          <div className="absolute inset-0 z-50">
            <div className="fixed inset-0 bg-black/30" onClick={toggleMobileMenu} />
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg animate-in slide-in-from-left">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold text-primary-blue">NOLATEC 360°</h2>
                <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
             
              <div className="h-[calc(100%-64px)] overflow-y-auto">
                <Sidebar isMobileMenuOpen={true} />
              </div>
            </div>
          </div>
        </aside>
      )}
    </header>
  );

  // Internal Sidebar component for mobile view
  function Sidebar({ isMobileMenuOpen = false }) {
    const location = useLocation();
    const { isAdmin, isManager } = useAuth();
    const dispatch = useAppDispatch();
  
    const handleLogout = () => {
      dispatch(logoutUser());
      setIsMobileMenuOpen(false);
    };
  
    const links = [
      { name: 'Dashboard', href: '/dashboard', icon: Home, allowedRoles: ['Admin', 'Manager', 'Employee'] },
      { name: 'Evaluations', href: '/evaluations', icon: ClipboardCheck, allowedRoles: ['Admin', 'Manager'] },
      { name: 'Reports', href: '/reports', icon: BarChart3, allowedRoles: ['Admin', 'Manager'] },
      { name: 'My Profile', href: '/profile', icon: UserRound, allowedRoles: ['Admin', 'Manager', 'Employee'] },
      { name: 'Employees', href: '/employees', icon: Users, allowedRoles: ['Admin'] },
      { name: 'Register User', href: '/register', icon: UserPlus, allowedRoles: ['Admin'] },    
    ];
  
    return (
      <div className="flex flex-col h-full">
        <nav className="px-2 py-4 flex-grow">
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
                      onClick={() => setIsMobileMenuOpen(false)}
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
        <div className="p-4 border-t border-gray-200 mt-auto">
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
    );
  }
}
