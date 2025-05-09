import { defineStore } from "pinia";
import api from "./api.js";

export const useAgentsStore = defineStore("agentsStore", {
  state() {
    return {
      voces:["alloy","ash","ballad","coral","echo","sage","shimmer","verse"],
      agentes: [],
    };
  },
  getters: {
    getAgent: (state) => async (id) => (await api.agents.getOne(id)).data,
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
      }
    },
    async addAgent(agent) {
      try {
        const response = await api.agents.create(agent);
        if (response) {
          this.agentes.push(agent);
        }
      } catch (response) {
        console.error("Error: " + response.message);
      }
    },
    async modAgent(agentMod) {
      try {
        const response = await api.agents.modify(agentMod);
        if (response) {
          const indice = this.agentes.findIndex((agent) => agent.id === agentMod.id);
          this.agentes.splice(indice, 1);
          this.agentes.push(agentMod);
        }
      } catch (response) {
        console.error("Error: " + response.message);
      }
    },
    async delAgent(index) {
      try {
        const indice = this.agentes.findIndex((agent) => agent.id === index);
        const response = await api.agents.delete(index.id);
        if (response) {
          this.agentes.splice(indice, 1);
        }
      } catch (response) {
        console.error("Error: " + response.message);
      }
    },
  },
});
