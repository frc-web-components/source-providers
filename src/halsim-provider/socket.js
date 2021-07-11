

export default class HalSimSocket {

  constructor() {
    this.socketOpen = false;
    this.socket = null;
    this.connectionListeners = [];
    this.messageListeners = [];
    this.reconnectTimeoutId = null;
  }

  connect(address) {
    if (this.socket && this.socket.url !== address) {
      if (this.reconnectTimeoutId !== null) {
        clearTimeout(this.reconnectTimeoutId);
      }
      this.socket.onclose = () => {};
      this.socket.close();
      console.info("Socket closed");
      this.connectionListeners.forEach(listener => {
        listener(false);
      });
    }

    this.socket = new WebSocket(address);
    if (this.socket) {
      this.socket.onopen = function () {
        console.info("Socket opened");
        this.socketOpen = true;
        this.connectionListeners.forEach(listener => {
          listener(true);
        });
      };
  
      this.socket.onmessage = function (msg) {
        const data = JSON.parse(msg.data);
        this.messageListeners.forEach(listener => {
          listener(data);
        });
      };
  
      this.socket.onclose = function () {
        if (this.socketOpen) {
          console.info("Socket closed");
          this.connectionListeners.forEach(listener => {
            listener(false);
          });
        }
        // respawn the websocket
        this.reconnectTimeoutId = setTimeout(() => {
          this.connect(address);
        }, 300);
      };
    }
  }

  sendMsg(o) {
    if (this.socket) {
      const msg = JSON.stringify(o);
      this.socket.send(msg);
    }
  }

  isConnected() {
    return this.socketOpen;
  }

  addConnectionListener(listener, immediatelyNotify) {
    this.connectionListeners.push(listener);
    if (immediatelyNotify) {
      listener(this.socketOpen);
    }
  }

  addMessageListener(listener) {
    this.messageListeners.push(listener);
  }
}
