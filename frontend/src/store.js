import EventEmitter from "eventemitter3";

const store = {
  messages: [],
  eventEmitter: new EventEmitter(),

  addMessage(message) {
    this.messages.push(message);
    this.eventEmitter.emit("change");
  },

  clearMessages() {
    this.messages = [];
    this.eventEmitter.emit("change");
  },

  getMessages() {
    return this.messages;
  },

  removeMessage() {
    this.messages.shift();
    this.eventEmitter.emit("change");
  },

  subscribe(callback) {
    this.eventEmitter.on("change", callback);
    return () => this.eventEmitter.off("change", callback);
  },
};

export default store;
