import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Custom hook for managing notifications and real-time updates
export const useNotifications = (userId) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Mock WebSocket connection for real-time notifications
    useEffect(() => {
        if (!userId) return;

        // In a real application, this would be a WebSocket connection
        // For now, we'll simulate periodic notifications
        const interval = setInterval(() => {
            // Simulate receiving notifications
            const mockNotifications = [
                {
                    id: Date.now(),
                    type: 'medical_order_approved',
                    title: 'Đơn thuốc đã được duyệt',
                    message: 'Đơn thuốc cho con của bạn đã được y tá duyệt',
                    timestamp: new Date(),
                    read: false,
                    priority: 'high'
                },
                {
                    id: Date.now() + 1,
                    type: 'health_checkup_reminder',
                    title: 'Nhắc nhở khám sức khỏe',
                    message: 'Đến lúc khám sức khỏe định kỳ cho con',
                    timestamp: new Date(),
                    read: false,
                    priority: 'medium'
                }
            ];

            // Randomly add notifications (simulate real-time)
            if (Math.random() > 0.8) {
                const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
                setNotifications(prev => [randomNotification, ...prev]);
                setUnreadCount(prev => prev + 1);

                // Show toast notification
                toast.info(randomNotification.message, {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        }, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, [userId]);

    const markAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId
                    ? { ...notif, read: true }
                    : notif
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
        setUnreadCount(0);
    };

    const clearNotification = (notificationId) => {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        setUnreadCount(prev => {
            const notification = notifications.find(n => n.id === notificationId);
            return notification && !notification.read ? Math.max(0, prev - 1) : prev;
        });
    };

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotification
    };
};

export default useNotifications;
