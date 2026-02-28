import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '../services/api.config';

export interface NotificationData {
    notificationId: number;
    message: string;
    type: string;
    sentAt: string;
    isRead: boolean;
    bookingId?: number;
}

export const useNotificationSocket = (onNotification?: (notification: NotificationData) => void) => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const onNotificationRef = useRef(onNotification);

    // Keep callback ref updated
    useEffect(() => {
        onNotificationRef.current = onNotification;
    }, [onNotification]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.log('No token found, skipping WebSocket connection');
            return;
        }

        // Prevent multiple connections
        if (socketRef.current?.connected) {
            console.log('Socket already connected, skipping initialization');
            return;
        }

        console.log('Initializing WebSocket connection...');

        // Initialize socket connection
        const socket = io(API_CONFIG.MAIN_BACKEND_URL.replace('/api', ''), {
            auth: {
                token
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            autoConnect: true
        });

        socketRef.current = socket;

        // Connection event handlers
        socket.on('connect', () => {
            console.log('✅ WebSocket connected');
            setIsConnected(true);
            setConnectionError(null);
        });

        socket.on('disconnect', (reason) => {
            console.log('❌ WebSocket disconnected:', reason);
            setIsConnected(false);
        });

        socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error.message);
            setConnectionError(error.message);
            setIsConnected(false);
        });

        // Listen for new notifications
        socket.on('notification:new', (notification: NotificationData) => {
            console.log('📨 New notification received:', notification);
            if (onNotificationRef.current) {
                onNotificationRef.current(notification);
            }
        });

        // Listen for broadcast notifications
        socket.on('notification:broadcast', (notification: NotificationData) => {
            console.log('📢 Broadcast notification received:', notification);
            if (onNotificationRef.current) {
                onNotificationRef.current(notification);
            }
        });

        // Cleanup on unmount
        return () => {
            console.log('Disconnecting WebSocket');
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
            socket.off('notification:new');
            socket.off('notification:broadcast');
            socket.disconnect();
            socketRef.current = null;
        };
    }, []); // Empty dependency array - only run once

    const markAsRead = (notificationId: number) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('notification:read', { notificationId });
        }
    };

    return {
        isConnected,
        connectionError,
        markAsRead
    };
};

