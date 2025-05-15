import { defineStore } from "pinia";
import api from "./api.js";

export const useAgentsStore = defineStore("agentsStore", {
  state() {
    return {
      voces: [
        "alloy",
        "ash",
        "ballad",
        "coral",
        "echo",
        "sage",
        "shimmer",
        "verse",
      ],
      agentes: [],
    };
  },
  getters: {
    getAgent: (state) => async (id) => (await api.agents.getOne(id)).data,
    makeCalls: (state) => async (id) => (await api.agents.make_calls(id)).data,
  },
  actions: {
    async populateAgents() {
      try {
        //console.log("Hola");

        const response = await api.agents.getAll();
        //console.log(response.data.agents);

        this.agentes = response.data.agents;
      } catch (response) {
        console.error("Error: " + response);
      } finally {
        this.updateStorage();
      }
    },
    async addAgent(agent) {
      try {
        const response = await api.agents.create(agent);
        if (response) {
          this.agentes.push(agent);
          this.updateStorage();
        }
      } catch (response) {
        console.error("Error: " + response.message);
      } finally {
        this.updateStorage();
      }
    },
    async modAgent(agentMod) {
      try {
        const response = await api.agents.modify(agentMod);
        if (response) {
          const indice = this.agentes.findIndex(
            (agent) => agent.id === agentMod.id
          );
          this.agentes.splice(indice, 1);
          this.agentes.push(agentMod);
        }
      } catch (response) {
        console.error("Error: " + response.message);
      } finally {
        this.updateStorage();
      }
    },
    async delAgent(index) {
      try {
        const indice = this.agentes.findIndex((agent) => agent.id === index);
        const response = await api.agents.delete(index.id);
        if (response) {
          this.agentes.splice(indice, 1);
          this.updateStorage();
        }
      } catch (response) {
        console.error("Error: " + response.message);
      } finally {
        this.updateStorage();
      }
    },
    updateStorage() {
      if (localStorage.getItem("agentes")) {
        localStorage.removeItem("agentes");
      }
      localStorage.setItem("agentes", JSON.stringify(this.agentes));
    },
  },
});
