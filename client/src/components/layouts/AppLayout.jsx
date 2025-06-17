import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/authSlice';
import { authUtils } from '../../utils/authUtil';

export default function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check if user is authenticated and redirect accordingly
  const currentPath = window.location.pathname;
  useEffect(() => {
    const authenticateUser = async () => {
      const user = await authUtils.isAuthenticated();
      const pathName = window.location.pathname;
      if (user) {
        dispatch(setUser({ user }));
        
        if (['/login', '/password/forgot', '/password/reset', '/signup'].some(p => pathName.startsWith(p))) {
          navigate(currentPath === '/login' ? '/nurse/students' : currentPath);
        } else {
          navigate('/login');
        }
      }
    };
    authenticateUser();
  }, [dispatch, navigate]);
  return (
    <Outlet />
  );
}