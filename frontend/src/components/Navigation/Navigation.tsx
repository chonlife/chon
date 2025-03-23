import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import routes from '../../router.ts';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useLanguage();

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
      {navRoutes.map((route) => (
        <Link
          key={route.path}
          to={route.path}
          className={`nav-link ${isActive(route.path) ? 'active' : ''}`}
        >
          {getTranslatedName(route.name)}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation; 