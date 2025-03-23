import React from 'react';
import Home from './pages/Home/Home.tsx';
import Intro from './pages/Intro/Intro.tsx';
import PersonalityTest from './pages/PersonalityTest/PersonalityTest.tsx';
import Contact from './pages/Contact/Contact.tsx';
import Login from './pages/Login/Login.tsx';

export interface Route {
  path: string;
  component: React.ComponentType;
  name: string;
  showInNav?: boolean;
}

const routes: Route[] = [
  {
    path: '/',
    component: Home,
    name: 'HOME',
    showInNav: true,
  },
  {
    path: '/intro',
    component: Intro,
    name: 'INTRO',
    showInNav: false,
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
];

export default routes; 