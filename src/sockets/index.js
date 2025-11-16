// src/sockets/index.js

let socket = null;
let listeners = new Map();
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 3000;
let isConnecting = false;
let token = null; // Lưu token nếu cần auth
let shouldReconnect = true;
let reconnectTimeoutId = null;

/**
 * Init WebSocket singleton
 * @param {string} url - full WS URL (có token nếu cần)
 * @returns {WebSocket} socket instance
 */
export const initSocket = (url) => {
  token = url.includes("token=") ? url.split("token=")[1] : null;

  if (socket?.readyState === WebSocket.OPEN) {
    console.log("WebSocket already connected");
    return socket;
  }

  if (isConnecting) {
    console.log("WebSocket connecting, wait...");
    return socket;
  }

  if (reconnectTimeoutId) {
    clearTimeout(reconnectTimeoutId);
    reconnectTimeoutId = null;
  }

  isConnecting = true;

  socket = new WebSocket(url);

  socket.addEventListener("open", () => {
    console.log("WebSocket connected");
    reconnectAttempts = 0;
    isConnecting = false;
    shouldReconnect = true;
    notifyListeners("status", { status: "connected" });
  });

  socket.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data);
      // notify all registered listeners
      notifyListeners("message", data);
    } catch (err) {
      console.error("WebSocket message parse error:", err);
    }
  });

  socket.addEventListener("close", (event) => {
    console.log("WebSocket closed:", event.code, event.reason);
    isConnecting = false;
    notifyListeners("status", { status: "disconnected" });

    if (
      shouldReconnect &&
      event.code !== 1000 &&
      reconnectAttempts < maxReconnectAttempts &&
      !isConnecting
    ) {
      reconnectAttempts++;
      console.log(`Reconnecting (${reconnectAttempts}/${maxReconnectAttempts})...`);

      reconnectTimeoutId = setTimeout(() => {
        if (token && shouldReconnect) {
          initSocket(url);
        }
      }, reconnectDelay);
    } else if (reconnectAttempts >= maxReconnectAttempts) {
      console.log("Max reconnect attempts reached");
      notifyListeners("error", { message: "Failed to reconnect" });
    }
  });

  socket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
    notifyListeners("status", { status: "error", error });
  });

  return socket;
};

/**
 * Get socket singleton
 */
export const getSocket = () => {
  if (!socket) throw new Error("Socket not initialized. Call initSocket(url) first.");
  return socket;
};

/**
 * Send message through socket
 */
export const sendMessage = (payload) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error("WebSocket not connected");
    return false;
  }

  try {
    socket.send(JSON.stringify(payload));
    return true;
  } catch (err) {
    console.error("Send message failed:", err);
    return false;
  }
};

/**
 * Listener management
 */
export const addListener = (id, callback) => {
  listeners.set(id, callback);
};

export const removeListener = (id) => {
  listeners.delete(id);
};

const notifyListeners = (type, data) => {
  listeners.forEach((cb) => {
    try {
      cb(type, data);
    } catch (err) {
      console.error("Error in listener:", err);
    }
  });
};

/**
 * Disconnect socket manually
 */
export const disconnect = () => {
  shouldReconnect = false;
  if (reconnectTimeoutId) {
    clearTimeout(reconnectTimeoutId);
    reconnectTimeoutId = null;
  }

  if (socket) {
    socket.onclose = null;
    socket.close(1000, "Manual disconnect");
    socket = null;
  }

  listeners.clear();
  reconnectAttempts = 0;
  token = null;
  isConnecting = false;
};

/**
 * Check if socket is connected
 */
export const isConnected = () => socket?.readyState === WebSocket.OPEN;
