import { defineStore } from "pinia";
import api from "./api.js";

export const useMessageStore = defineStore("messageStore", {
  state() {
    return {
      messages: [],
    };
  },
  actions: {
    addMessage(tipo, message) {
      console.log("Añadiendo mensaje");
      
      this.messages.push({ tipo: tipo, message: message });
    },
    delMessage(index) {
      console.log("Eliminando mensaje");
      
      this.messages.splice(index, 1);
    },
  },
});
