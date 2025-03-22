import React from 'react';
import Home from './pages/Home/Home.tsx';
import PersonalityTest from './pages/PersonalityTest/PersonalityTest.tsx';
import Contact from './pages/Contact/Contact.tsx';
import Login from './pages/Login/Login.tsx';

export interface Route {
  path: string;
  component: React.ComponentType;
  name: string;
}

const routes: Route[] = [
  {
    path: '/',
    component: Home,
    name: 'HOME',
  },
  {
    path: '/personality-test',
    component: PersonalityTest,
    name: 'PERSONALITY TEST',
  },
  {
    path: '/contact',
    component: Contact,
    name: 'CONTACT US',
  },
  {
    path: '/login',
    component: Login,
    name: 'LOGIN',
  },
];

export default routes; 