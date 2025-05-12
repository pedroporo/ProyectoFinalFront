<script>
import { useAgentsStore } from "@/stores/agentsStore";
import { mapState, mapActions } from "pinia";
import { Form, Field, ErrorMessage } from "vee-validate";

import AgentItemForm from "./AgentItemForm.vue";
export default {
  name: "agent-item",
  components: {
    Form,
    Field,
    ErrorMessage,
    AgentItemForm,
  },
  data() {
    return {
      agent: JSON.parse(localStorage.agentes)[this.$route.params.id - 1] || {},
      agentSchema,
      route: this.$route,
      agentId: this.$route.params.id,
      query: this.$route.query,
      regex: `/()/`,
    };
  },

  mounted() {
    this.loadSavedState();
  },
  computed: {
    ...mapState(useAgentsStore, {
      getAgent: "getAgent",
      voces: "voces",
      agentes: "agentes",
    }),
    test: {},
    /*agentId: this.$route.params.id,
    query: this.$route.query,*/
  },
  watch: {
    agentId(newValue, oldValue) {
      newValue !== oldValue ? this.getAgentId() : {};
    },

    "route.query.segmento": {
      handler(newQuery, oldQuery) {
        //console.log("Change in segment");
        if (newQuery !== oldQuery) {
          if (newVal === "agente") this.loadSavedState();
        }
      },
      deep: true, // Necesario para que detecte cambios dentro del objeto query
    },
    "route.params.id": {
      handler(newQuery, oldQuery) {
        if (newQuery !== oldQuery) {
          this.getAgentId();
        }
      },
      deep: true, // Necesario para que detecte cambios dentro del objeto query
    },
    $route(newValue, oldValue) {
      console.log(oldValue);

      console.log(newValue);

      //newValue.params.id !== oldValue.params.id ? this.getAgentId() : {};
    },
    query: {
      handler(newQuery, oldQuery) {
        if (newQuery !== oldQuery) {
          console.log(newQuery);
          console.log(oldQuery);
        }
      },
      deep: true, // Necesario para que detecte cambios dentro del objeto query
    },
  },
  methods: {
    segmentos(nombre) {
      this.route.query = {
        ...this.route.query,
        segmento: nombre,
      };
    },
    handleAgentUpdate(updatedAgent) {
      this.agent = updatedAgent;
      localStorage.setItem("agentState", JSON.stringify(updatedAgent));
    },
    segmentos(nombre) {
      localStorage.setItem("agentState", JSON.stringify(this.agent));
      this.$router.replace({
        query: { ...this.$route.query, segmento: nombre },
      });
    },
    loadSavedState() {
      const saved = localStorage.getItem("agentState");
      if (saved) this.agent = JSON.parse(saved);
    },
    async getAgentId() {
      try {
        this.agent = await this.getAgent(this.$route.params.id);
      } catch (error) {
        const response = JSON.parse(error.request.response);
        this.$notify({
          icon: "tim-icons icon-alert-circle-exc",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "danger",
          timeout: 3000,
          message: response.detail,
        });
        this.$router.push({ path: "/agents" });
      }
    },
    ...mapActions(useAgentsStore, ["modAgent", "addAgent"]),
  },
};
</script>
<template>
  <base-button
    slot="footer"
    type="primary"
    nativeType="button"
    @click="segmentos('agente')"
    link="true"
    fill
  >
    Agentes
  </base-button>
  <base-button
    slot="footer"
    type="primary"
    nativeType="button"
    @click="segmentos('llamadas')"
    link="true"
    fill
  >
    Llamadas
  </base-button>
  <agent-item-form
    v-if="
      route.query.segmento == 'agente' || route.query.segmento === undefined
    "
    :item="agent"
    @update-agent="handleAgentUpdate"
  ></agent-item-form>
</template>
<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
