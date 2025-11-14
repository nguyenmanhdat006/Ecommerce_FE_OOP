// src/lib/chatWebSocket.js

class ChatWebSocketManager {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.isConnecting = false;
    this.token = null; // Store token for reconnection
    this.shouldReconnect = true; // Flag to control auto-reconnect
    this.reconnectTimeoutId = null; // Store timeout ID to cancel if needed
  }

  connect(token) {
    // Store token for reconnection
    this.token = token;

    // Check if already connected or connecting
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return Promise.resolve();
    }

    if (this.isConnecting) {
      console.log("WebSocket already connecting, waiting...");
      return Promise.resolve();
    }

    // Cancel any pending reconnect
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      try {
        const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8080";
        const url = wsUrl.replace(/^http/, "ws") + `/ws/chat?token=${token}`;

        // Close existing socket if any (shouldn't happen, but just in case)
        if (this.socket) {
          this.socket.onclose = null; // Remove old handler to prevent reconnect
          this.socket.close();
        }

        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
          console.log("WebSocket connected");
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          this.shouldReconnect = true; // Reset flag on successful connection
          this.notifyListeners("status", { status: "connected" });
          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("WebSocket message received:", data);

            // Handle different message types
            if (data.error) {
              this.notifyListeners("error", data);
            } else if (data.status === "success") {
              this.notifyListeners("sent", data);
            } else if (data.senderId && data.content) {
              this.notifyListeners("message", data);
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        this.socket.onerror = (error) => {
          console.error("WebSocket error:", error);
          this.isConnecting = false;
          this.notifyListeners("status", { status: "error", error });
          // Don't reject here, let onclose handle it
        };

        this.socket.onclose = (event) => {
          console.log("WebSocket closed:", event.code, event.reason);
          this.isConnecting = false;
          this.notifyListeners("status", { status: "disconnected" });

          // Only auto-reconnect if:
          // 1. shouldReconnect is true
          // 2. Not a normal closure (code 1000)
          // 3. Haven't exceeded max attempts
          // 4. Not already connecting
          if (
            this.shouldReconnect &&
            event.code !== 1000 &&
            this.reconnectAttempts < this.maxReconnectAttempts &&
            !this.isConnecting
          ) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            
            // Clear any existing timeout
            if (this.reconnectTimeoutId) {
              clearTimeout(this.reconnectTimeoutId);
            }
            
            this.reconnectTimeoutId = setTimeout(() => {
              if (this.token && this.shouldReconnect) {
                this.connect(this.token).catch(console.error);
              }
            }, this.reconnectDelay);
          } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log("Max reconnect attempts reached, stopping auto-reconnect");
            this.notifyListeners("error", { 
              message: "Failed to reconnect after multiple attempts" 
            });
          }
        };
      } catch (error) {
        this.isConnecting = false;
        console.error("Error creating WebSocket:", error);
        reject(error);
      }
    });
  }

  sendMessage(receiverId, content) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return false;
    }

    try {
      const payload = {
        receiverId: receiverId.toString(),
        content: content.trim(),
      };

      this.socket.send(JSON.stringify(payload));
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  }

  addListener(id, callback) {
    this.listeners.set(id, callback);
  }

  removeListener(id) {
    this.listeners.delete(id);
  }

  notifyListeners(type, data) {
    this.listeners.forEach((callback) => {
      try {
        callback(type, data);
      } catch (error) {
        console.error("Error in WebSocket listener:", error);
      }
    });
  }

  disconnect() {
    // Disable auto-reconnect
    this.shouldReconnect = false;
    
    // Cancel any pending reconnect
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }
    
    if (this.socket) {
      // Remove onclose handler to prevent reconnect
      this.socket.onclose = null;
      this.socket.close(1000, "Manual disconnect");
      this.socket = null;
    }
    
    this.listeners.clear();
    this.reconnectAttempts = 0;
    this.token = null;
  }

  isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  getIsConnecting() {
    return this.isConnecting;
  }
}

// Singleton instance
export const chatWebSocket = new ChatWebSocketManager();

