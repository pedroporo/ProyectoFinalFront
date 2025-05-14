import { defineStore } from "pinia";
import api from "./api.js";

export const useLlamadasStore = defineStore("llamadaStore", {
  state() {
    return {
      llamadas: [],
    };
  },
  getters: {
    getCall: (state) => async (id) => (await api.calls.getOne(id)).data,
    getTranscript: (state) => async (id) =>
      (await api.calls.getTranscript(id)).data,
  },
  actions: {
    async populateCalls(agentId) {
      try {
        const response = await api.calls.getAll(agentId);

        this.llamadas = response.data.calls;
      } catch (response) {
        console.error("Error: " + response);
      }
    },
    async addCall(call) {
      try {
        const response = await api.calls.create(call);
        if (response) {
          this.llamadas.push(call);
        }
      } catch (response) {
        console.error("Error: " + response.message);
      }
    },
    async modCall(callMod) {
      try {
        const response = await api.calls.modify(callMod);
        if (response) {
          const indice = this.llamadas.findIndex(
            (call) => call.id === callMod.id
          );
          this.llamadas.splice(indice, 1);
          this.llamadas.push(callMod);
        }
      } catch (response) {
        console.error("Error: " + response.message);
      }
    },
    async delCall(index) {
      try {
        const indice = this.llamadas.findIndex((call) => call.id === index);
        const response = await api.calls.delete(index.id);
        if (response) {
          this.llamadas.splice(indice, 1);
        }
      } catch (response) {
        console.error("Error: " + response.message);
      }
    },
    async uploadCsv(csv, id) {
      try {
        const response = await api.calls.upload_csv(csv, id);

        if (response) {
          this.llamadas.push(response.data.calls);
        }
      } catch (response) {
        console.error("Error: " + response.message);
      }
    },
    async getRecording(id) {
      try {
        //const call = await this.getCall(id);
        //const response = await api.calls.getRecordingList(user, id);
        const response = await api.calls.getRecording(id);
        //console.log(response);
        
        return response;
      } catch (response) {
        console.error("Error: " + response.message);
      }
    },
  },
});
