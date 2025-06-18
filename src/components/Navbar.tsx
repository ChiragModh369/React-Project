import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Shield, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { showLog } from '@/commonFunctions/Functions';
import { useDispatch, useSelector } from 'react-redux';
import { CLEAR_LOGOUT } from '@/redux/actions/types/reduxConst';
import LoginForm from './LoginForm';
import { localStorageHelper } from '@/commonFunctions/localStorageHelper';
import { useToast } from '@/components/ui/use-toast';
import { fetchLogoutAction } from '@/redux/actions/mainAction';
import useApiStatusHandler from '@/hooks/useApiStatusHandler';
import { dispatchAPI } from '@/commonFunctions/dispatchAPI';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Courses', path: '/courses' },
  { name: 'Jobs', path: '/jobs' },
  { name: 'CV Builder', path: '/cv-builder' },
  { name: 'Coaching', path: '/coaching' },
];

const NavLinkItem = ({ path, name, onClick }: { path: string, name: string, onClick?: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  return (
    <Link
      to={path}
      className={cn(
        'transition-colors hover:text-cyber-blue',
        isActive ? 'text-cyber-blue' : 'text-foreground/80'
      )}
      onClick={onClick}
    >
      {name}
    </Link>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserLoginOpen, setIsUserLoginOpen] = useState(false);
  const handleLoginDialog = () => {
    setIsUserLoginOpen(!isUserLoginOpen)
  }
  const loginData = useSelector((data: any) => data.loginDataReducer);
  const { isLogoutLoading, logoutStatusCode, logoutMessage, logoutMainData } = useSelector((data: any) => data.logoutReducer);

  const handleLogout = () => {
    dispatch(fetchLogoutAction({ token: loginData?.token }));
  };

  useApiStatusHandler({
    statusCode: logoutStatusCode,
    message: logoutMessage,
    mainData: logoutMainData,
    clearAPI: () => dispatch({ type: CLEAR_LOGOUT }),
    onSuccess: () => {
      localStorageHelper.clear();
      dispatchAPI();
      toast({ title: 'Logged out', description: 'You have been logged out successfully' });
      navigate('/');
    },
    toast,
    navigate
  });

  const renderAuthButtons = (isMobile = false) => {
    return loginData?.token ? (
      <div className={cn("flex flex-col", isMobile ? "space-y-2" : "gap-2")}>
        <div className="text-sm font-medium">
          Welcome, <span className="text-cyber-blue">{loginData.name}</span>
        </div>
        <Button
          disabled={isLogoutLoading}
          variant="outline"
          onClick={() => {
            if (window.confirm("Are you sure you want to log out?")) {
              handleLogout();
            }
          }}
        >
          {isLogoutLoading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              <span className="text-cyber-gray">Logging out...</span>
            </>
          ) : "Logout"}
        </Button>
      </div>
    ) : (
      <Button
        variant="outline"
        className={cn("bg-cyber-blue hover:bg-cyber-blue/80 text-black", isMobile && "w-full")}
        onClick={() => setIsUserLoginOpen(true)}
      >
        Log In
      </Button>
    );
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-cyber-blue/20 backdrop-blur-md bg-background/90">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-cyber-blue animate-pulse-glow" />
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyber-blue to-cyber-green bg-clip-text text-transparent">
              CyberQuays
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ name, path }) => (
              <NavLinkItem key={path} path={path} name={name} />
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {renderAuthButtons()}
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden absolute w-full bg-card shadow-lg transition-all duration-300 ease-in-out border-b border-border",
          isOpen ? "max-h-96 py-4 opacity-100" : "max-h-0 py-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-4">
          {navItems.map(({ name, path }) => (
            <NavLinkItem key={path} path={path} name={name} onClick={() => setIsOpen(false)} />
          ))}
          <hr className="border-border" />
          {renderAuthButtons(true)}
        </div>
      </div>

      <LoginForm
        open={isUserLoginOpen}
        onOpenChange={handleLoginDialog}
        onSubmit={() => showLog("login done")}
        title="Access Your Account"
      />
    </nav>
  );
};

export default Navbar;
