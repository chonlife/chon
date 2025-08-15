import { lazy } from 'react';
import Home from './pages/Home/Home';
import PersonalityTest from './pages/PersonalityTest/PersonalityTest';
import Contact from './pages/Contact/Contact';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile.tsx';

export interface Route {
  path: string;
  component: React.ComponentType;
  name: string;
  showInNav: boolean;
  children?: Route[];
}

const routes: Route[] = [
  {
    path: '/',
    component: Home,
    name: 'HOME',
    showInNav: true,
  },
  {
    path: '/personality-test',
    component: PersonalityTest,
    name: 'PERSONALITY TEST',
    showInNav: true,
  },
  {
    path: '/contact',
    component: Contact,
    name: 'CONTACT US',
    showInNav: true,
  },
  {
    path: '/login',
    component: Login,
    name: 'LOGIN',
    showInNav: true,
  },
  {
    path: '/profile',
    component: Profile,
    name: 'PROFILE',
    showInNav: false,
  },
];

export default routes; 