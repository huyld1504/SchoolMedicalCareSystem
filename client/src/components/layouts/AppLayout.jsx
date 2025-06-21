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
      try {
        const user = await authUtils.isAuthenticated();
        const pathName = window.location.pathname;

        if (user) {
          dispatch(setUser({ user }));

          // If user is authenticated but on auth pages, redirect to dashboard
          if (['/login', '/password/forgot', '/password/reset', '/signup'].some(p => pathName.startsWith(p))) {
            if (user.role === 'nurse') {
              navigate('/nurse/students');
            } else if (user.role === 'parent') {
              navigate('/parent/children');
            }
          }
          // If authenticated and on allowed page, stay there
        } else {
          // If not authenticated and not on public pages, redirect to login
          if (!['/login', '/password/forgot', '/password/reset', '/signup', '/'].some(p => pathName.startsWith(p))) {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        navigate('/login');
      }
    };
    authenticateUser();
  }, [dispatch, navigate]);
  return (
    <Outlet />
  );
}