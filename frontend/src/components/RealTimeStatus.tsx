'use client';

import { useWebSocket } from '@/hooks/useWebSocket';
import { Wifi, WifiOff, Users, Activity } from 'lucide-react';

export default function RealTimeStatus() {
  const { isConnected, onlineUsers } = useWebSocket();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-3 min-w-[200px]">
        {/* Connection Status */}
        <div className="flex items-center gap-2 mb-2">
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">
                Real-time Connected
              </span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600 dark:text-red-400">
                Disconnected
              </span>
            </>
          )}
        </div>

        {/* Online Users */}
        {isConnected && onlineUsers.length > 0 && (
          <div className="border-t pt-2">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Online ({onlineUsers.length})
              </span>
            </div>
            <div className="space-y-1">
              {onlineUsers.slice(0, 3).map((user, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user}
                  </span>
                </div>
              ))}
              {onlineUsers.length > 3 && (
                <div className="text-xs text-gray-400 pl-4">
                  +{onlineUsers.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Activity Indicator */}
        {isConnected && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t">
            <Activity className="w-3 h-3 text-blue-500 animate-pulse" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Live updates active
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
