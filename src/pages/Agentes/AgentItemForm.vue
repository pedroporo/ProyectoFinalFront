<script>
import { useAgentsStore } from "@/stores/agentsStore";
import { mapState, mapActions } from "pinia";
import { Form, Field, ErrorMessage } from "vee-validate";

import * as yup from "yup";

export default {
  name: "agent-item-form",
  props: ["item"],
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const agentSchema = yup.object({
      name: yup.string().required("El nombre del agente es obligatorio"),
      password: yup.string().required("Introduce la contraseña"),
      voice: yup
        .string(
          "¿Eh?, Aqui solo puede ir texto, ¿como hiciste para meter algo que no sea texto?"
        )
        .required(
          "¿Por que no quieres seleccionar una voz?¿Como piensas que se comunique?"
        )
        .matches(
          /(new|good|used|bad)/,
          "Oye, solo se puede poner las voces que te damos. ¿Como te las arreglaste para meter algo que no sea eso?"
        ),
    });
    return {
      agent: JSON.parse(localStorage.getItem("agentState")) || this.item || {},
      agentSchema,
      route: this.$route,
      agentId: this.$route.params.id,
      query: this.$route.query,
      regex: `/()/`,
    };
  },

  mounted() {
    if (!JSON.parse(localStorage.getItem("agentState"))) {
      this.getAgentId();
      //this.agentId = this.$route.params.id;
    }
    this.regex = `/(${this.voces.join("|")})/`;
  },
  computed: {
    ...mapState(useAgentsStore, {
      getAgent: "getAgent",
      voces: "voces",
    }),
    /*agentId: this.$route.params.id,
    query: this.$route.query,*/
  },
  watch: {
    agent: {
      handler(newVal) {
        this.$emit("update-agent", newVal);
      },
      deep: true,
    },
  },
  methods: {
    async addUser() {
      try {
        if (!this.agent.id) {
          await this.addAgent(this.agent);
        } else {
          await this.modAgent(this.agent);
        }
      } catch (error) {
        console.log(error);
      }
      this.book = {};
      this.$router.push({ path: "/dashboard" });
    },
    controlForm() {
      if (!this.agent.id) {
        this.agent = {};
      } else {
        this.getAgentId();
      }
    },
    async getAgentId() {
      try {
        this.$notify({
          icon: "tim-icons icon-zoom-split",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "primary",
          timeout: 3000,
          message: "Iniciando la busqueda del agente",
        });
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
  <div class="login-page">
    <card>
      <h5 slot="header" v-if="!this.agent.id" class="title">Crear agente</h5>
      <h5 slot="header" v-else class="title">{{ this.agent.name }}</h5>
      <Form
        class="form login-form"
        ref="loginForm"
        :v-model="agent"
        :validation-schema="agentSchema"
        @submit="addUser"
        @reset="controlForm"
      >
        <div class="">
          <base-input>
            <label for="username">Nombre</label>
            <Field
              name="username"
              ref="username"
              placeholder="Introduce el nombre del agente (opcional)"
              type="text"
              :class="[
                'form-control',
                {
                  'is-valid':
                    $refs.username?.meta.valid && $refs.username?.meta.touched,
                  'is-invalid':
                    $refs.username?.meta.valid === false &&
                    $refs.username?.meta.touched,
                },
              ]"
              v-model="agent.name"
            >
            </Field>
            <ErrorMessage class="invalid-feedback" name="username" />
          </base-input>
        </div>
        <div class="">
          <base-input>
            <label for="password">Password </label>
            <Field
              name="password"
              ref="password"
              :class="[
                'form-control',
                {
                  'is-valid':
                    $refs.password?.meta.valid && $refs.password?.meta.touched,
                  'is-invalid':
                    $refs.password?.meta.valid === false &&
                    $refs.password?.meta.touched,
                },
              ]"
              placeholder="Introduce contraseña"
              v-model="agent.password"
              type="password"
              required
            />

            <ErrorMessage class="invalid-feedback" name="password" />
          </base-input>
        </div>

        <base-button slot="footer" type="primary" nativeType="submit" fill>
          Guardar
        </base-button>
      </Form>
    </card>
  </div>
</template>
<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
