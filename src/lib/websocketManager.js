// Lightweight WebSocketManager
// Usage:
// const ws = new WebSocketManager(url, { autoReconnect: true, reconnectInterval: 2000 });
// ws.on('open', () => {});
// ws.on('message', (msg) => {});
// ws.send({ type: 'ping' });
// ws.close();

class WebSocketManager {
  constructor(url, options = {}) {
    this.url = url;
    this.autoReconnect = options.autoReconnect ?? true;
    this.reconnectInterval = options.reconnectInterval ?? 2000;
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? Infinity;
    this.readyState = WebSocket.CLOSED;

    this.ws = null;
    this.attempts = 0;
    this.eventHandlers = {
      open: new Set(),
      message: new Set(),
      close: new Set(),
      error: new Set(),
    };

    this._shouldReconnect = this.autoReconnect;
  }

  connect() {
    if (this.ws) return;
    this._shouldReconnect = this.autoReconnect;
    this._createSocket();
  }

  _createSocket() {
    try {
      this.ws = new WebSocket(this.url);
    } catch (err) {
      this._emit('error', err);
      this._scheduleReconnect();
      return;
    }

    this.ws.onopen = (ev) => {
      this.attempts = 0;
      this.readyState = this.ws.readyState;
      this._emit('open', ev);
    };

    this.ws.onmessage = (ev) => {
      this._emit('message', ev);
    };

    this.ws.onerror = (ev) => {
      this._emit('error', ev);
    };

    this.ws.onclose = (ev) => {
      this.readyState = WebSocket.CLOSED;
      this.ws = null;
      this._emit('close', ev);
      this._scheduleReconnect();
    };
  }

  _scheduleReconnect() {
    if (!this._shouldReconnect) return;
    if (this.attempts >= this.maxReconnectAttempts) return;
    this.attempts += 1;
    setTimeout(() => {
      this._createSocket();
    }, this.reconnectInterval);
  }

  send(data) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not open');
    }
    const payload = typeof data === 'string' ? data : JSON.stringify(data);
    this.ws.send(payload);
  }

  close() {
    this._shouldReconnect = false;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  on(event, handler) {
    if (!this.eventHandlers[event]) this.eventHandlers[event] = new Set();
    this.eventHandlers[event].add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    this.eventHandlers[event]?.delete(handler);
  }

  _emit(event, payload) {
    this.eventHandlers[event]?.forEach((h) => {
      try {
        h(payload);
      } catch (err) {
        // swallow handler errors
        // console.error('WebSocket handler error', err);
      }
    });
  }
}

export default WebSocketManager;
