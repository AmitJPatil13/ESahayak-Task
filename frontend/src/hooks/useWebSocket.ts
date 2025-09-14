import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { io, Socket } from 'socket.io-client';

interface WebSocketMessage {
  type: string;
  data: any;
}

export function useWebSocket() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const handleMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'buyer:updated':
        showSuccess(`Buyer updated by ${message.data.updatedBy}`);
        window.dispatchEvent(new CustomEvent('buyer:refresh'));
        break;

      case 'buyer:created':
        showSuccess(`New buyer added: ${message.data.buyer?.fullName || 'Unknown'}`);
        window.dispatchEvent(new CustomEvent('buyer:refresh'));
        break;

      case 'buyer:deleted':
        showSuccess(`Buyer deleted by ${message.data.deletedBy}`);
        window.dispatchEvent(new CustomEvent('buyer:refresh'));
        break;

      case 'csv:imported':
        showSuccess(`CSV import complete: ${message.data.count} buyers imported`);
        window.dispatchEvent(new CustomEvent('buyer:refresh'));
        break;

      case 'user:active':
        setOnlineUsers(prev => {
          const updated = [...prev];
          if (!updated.includes(message.data.userEmail)) {
            updated.push(message.data.userEmail);
          }
          return updated;
        });
        break;

      default:
        console.log('Unknown WebSocket message type:', message.type);
    }
  };

  const notifyBuyerUpdate = (buyerId: string, changes: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('buyer:update', { buyerId, changes });
    }
  };

  const notifyBuyerCreate = (buyer: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('buyer:create', { buyer });
    }
  };

  const notifyBuyerDelete = (buyerId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('buyer:delete', { buyerId });
    }
  };

  const notifyUserActivity = (activity: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('user:activity', { activity });
    }
  };

  useEffect(() => {
    // Connect even without user for demo purposes
    if (!socketRef.current) {
      console.log('🔌 Attempting WebSocket connection to http://localhost:5000');
      socketRef.current = io('http://localhost:5000', {
        auth: {
          token: 'demo-token' // Simplified for demo
        },
        timeout: 20000,
        forceNew: true
      });

      socketRef.current.on('connect', () => {
        setIsConnected(true);
        console.log('✅ WebSocket connected successfully');
      });

      socketRef.current.on('disconnect', (reason) => {
        setIsConnected(false);
        console.log('❌ WebSocket disconnected:', reason);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('❌ WebSocket connection error:', error);
        setIsConnected(false);
      });

      // Listen for real-time events
      socketRef.current.on('buyer:updated', handleMessage);
      socketRef.current.on('buyer:created', handleMessage);
      socketRef.current.on('buyer:deleted', handleMessage);
      socketRef.current.on('csv:imported', handleMessage);
      socketRef.current.on('user:active', handleMessage);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // Remove user dependency

  // Update online users based on connection
  useEffect(() => {
    if (isConnected) {
      setOnlineUsers([user?.email || 'demo@esahayak.com']);
    } else {
      setOnlineUsers([]);
    }
  }, [isConnected, user]);

  return {
    isConnected,
    onlineUsers,
    notifyBuyerUpdate,
    notifyBuyerCreate,
    notifyBuyerDelete,
    notifyUserActivity
  };
}
