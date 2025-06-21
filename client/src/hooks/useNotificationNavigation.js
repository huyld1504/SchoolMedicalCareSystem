import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

export const useNotificationNavigation = () => {
  const [notificationQueue, setNotificationQueue] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Add a new notification to the queue
  const addNotification = (notification) => {
    setNotificationQueue(prev => [...prev, notification]);
  };

  // Process notifications when route changes
  useEffect(() => {
    if (notificationQueue.length > 0) {
      const [currentNotification, ...remaining] = notificationQueue;

      // If notification has a route, navigate to it
      if (currentNotification.route && location.pathname !== currentNotification.route) {
        navigate(currentNotification.route);
      }

      setNotificationQueue(remaining);
    }
  }, [location, notificationQueue, navigate]);

  return { addNotification };
};

export default useNotificationNavigation;
