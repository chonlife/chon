import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import routes from '../../router.ts';
import './Navigation.css';
import { useAuth } from '../../contexts/AuthContext.tsx';

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  const getTranslatedName = (routeName: string) => {
    switch(routeName) {
      case 'HOME':
        return t.navigation.home;
      case 'PERSONALITY TEST':
        return t.navigation.personalityTest;
      case 'CONTACT US':
        return t.navigation.contact;
      case 'LOGIN':
        return t.navigation.login || 'Login';
      case 'PROFILE':
        return t.navigation.profile || 'Profile';
      default:
        return routeName;
    }
  };

  const isActive = (path: string) => {
    // 检查当前路径是否是该路由或其子路由
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  const navRoutes = routes.filter(route => route.showInNav !== false);

  return (
    <nav className="nav-menu">
      {navRoutes.map((route) => {
        const path = (route.name === 'LOGIN' && isAuthenticated) ? '/profile' : route.path;
        const label = (route.name === 'LOGIN' && isAuthenticated) ? getTranslatedName('PROFILE') : getTranslatedName(route.name);
        return (
          <Link
            key={route.path}
            to={path}
            className={`nav-link ${isActive(path) ? 'active' : ''}`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation; 