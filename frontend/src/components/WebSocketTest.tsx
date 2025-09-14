'use client';

import { useWebSocket } from '@/hooks/useWebSocket';

export default function WebSocketTest() {
  const { isConnected, onlineUsers } = useWebSocket();

  return (
    <div className="fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border">
      <h3 className="font-semibold mb-2">WebSocket Debug</h3>
      <div className="space-y-2 text-sm">
        <div>
          Status: <span className={isConnected ? 'text-green-500' : 'text-red-500'}>
            {isConnected ? 'Connected ✅' : 'Disconnected ❌'}
          </span>
        </div>
        <div>
          Online Users: {onlineUsers.length > 0 ? onlineUsers.join(', ') : 'None'}
        </div>
        <div className="text-xs text-gray-500">
          Check browser console for connection logs
        </div>
      </div>
    </div>
  );
}
