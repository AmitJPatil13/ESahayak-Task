import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userEmail?: string;
}

export function setupWebSocket(server: HttpServer) {
  console.log('🔌 Initializing WebSocket server...');
  const io = new Server(server, {
    cors: {
      origin: '*', // Allow all origins in development
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Simplified authentication for now
  io.use((socket: AuthenticatedSocket, next) => {
    console.log('🔑 New WebSocket connection attempt');
    try {
      // For demo purposes, allow all connections
      socket.userId = 'demo-user-id';
      socket.userEmail = 'demo@esahayak.com';
      console.log(`✅ Authenticated WebSocket connection for ${socket.userEmail}`);
      next();
    } catch (error) {
      console.error('❌ WebSocket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`🔌 User ${socket.userEmail} connected via WebSocket`);

    // Join user-specific room for notifications
    socket.join(`user:${socket.userId}`);

    // Handle buyer updates
    socket.on('buyer:update', (data) => {
      // Broadcast to all connected users except sender
      socket.broadcast.emit('buyer:updated', {
        buyerId: data.buyerId,
        updatedBy: socket.userEmail,
        timestamp: new Date().toISOString(),
        changes: data.changes
      });
    });

    // Handle buyer creation
    socket.on('buyer:create', (data) => {
      socket.broadcast.emit('buyer:created', {
        buyer: data.buyer,
        createdBy: socket.userEmail,
        timestamp: new Date().toISOString()
      });
    });

    // Handle buyer deletion
    socket.on('buyer:delete', (data) => {
      socket.broadcast.emit('buyer:deleted', {
        buyerId: data.buyerId,
        deletedBy: socket.userEmail,
        timestamp: new Date().toISOString()
      });
    });

    // Handle CSV import completion
    socket.on('csv:import:complete', (data) => {
      socket.broadcast.emit('csv:imported', {
        count: data.count,
        importedBy: socket.userEmail,
        timestamp: new Date().toISOString()
      });
    });

    // Handle user activity tracking
    socket.on('user:activity', (data) => {
      socket.broadcast.emit('user:active', {
        userId: socket.userId,
        userEmail: socket.userEmail,
        activity: data.activity,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('disconnect', () => {
      console.log(`🔌 User ${socket.userEmail} disconnected`);
    });
  });

  return io;
}

// Helper function to emit real-time notifications
export function emitBuyerUpdate(io: Server, buyerId: string, updatedBy: string, changes: any) {
  io.emit('buyer:updated', {
    buyerId,
    updatedBy,
    changes,
    timestamp: new Date().toISOString()
  });
}

export function emitBuyerCreated(io: Server, buyer: any, createdBy: string) {
  io.emit('buyer:created', {
    buyer,
    createdBy,
    timestamp: new Date().toISOString()
  });
}

export function emitBuyerDeleted(io: Server, buyerId: string, deletedBy: string) {
  io.emit('buyer:deleted', {
    buyerId,
    deletedBy,
    timestamp: new Date().toISOString()
  });
}
