import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header.jsx';
import { ensureNotificationContainer } from '../utils/notifications.js';

export default function Layout() {
  useEffect(() => {
    ensureNotificationContainer();
  }, []);
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
