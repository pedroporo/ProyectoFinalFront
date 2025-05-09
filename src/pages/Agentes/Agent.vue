<script>
import { useAgentsStore } from "@/stores/agentsStore";
import { mapState, mapActions } from "pinia";
import { Form, Field, ErrorMessage } from "vee-validate";

import * as yup from "yup";

export default {
  name: "agent-item",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const agentSchema = yup.object({
      username: yup.string().required("El nombre del agente es obligatorio"),
      password: yup.string().required("Introduce la contraseña"),
    });
    return {
      agent: {},
      agentSchema,
      route: this.$route,
      agentId: this.$route.params.id,
      query: this.$route.query,
    };
  },

  mounted() {
    //console.log(this.$route.query);
    this.$watch(
      "query",
      function () {
        console.log("query cambia");
      },
      {
        deep: true,
      }
    );
    this.$watch(
      "query",
      function (newVal, oldVal) {
        ///this.results.push('Old value:'+oldVal+', new value: '+newVal)
        console.log(`Query old val: ${oldVal.test}`);

        console.log(`Query new val: ${newVal.test}`);
      },
      {
        deep: true,
      }
    );
    this.$watch(
      "agentId",
      function (newVal, oldVal) {
        ///this.results.push('Old value:'+oldVal+', new value: '+newVal)
        console.log("AgentId old val: " + oldVal);

        console.log("AgentId old val: " + newVal);
      },
      {
        deep: true,
      }
    );
    /*if (this.$route.params.id) {
      //this.getAgentId();
      this.agentId = this.$route.params.id;
    }*/
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
    agentId(newValue, oldValue) {
      console.log(oldValue);

      console.log(newValue);

      //newValue.params.id !== oldValue.params.id ? this.getAgentId() : {};
    },
    /*query: {
      handler(newQuery, oldQuery) {
        console.log(newQuery);
        console.log(oldQuery);
        if (newQuery !== oldQuery) {
          console.log(newQuery);
          console.log(oldQuery);
        }
      },
      deep: true, // Necesario para que detecte cambios dentro del objeto query
    },*/
    "route.query": {
      handler(newQuery, oldQuery) {
        console.log("Change in route");
        if (newQuery !== oldQuery) {
          console.log(newQuery);
          console.log(oldQuery);
        }
      },
      deep: true, // Necesario para que detecte cambios dentro del objeto query
    },

    $route(newValue, oldValue) {
      console.log(oldValue);

      console.log(newValue);

      newValue.params.id !== oldValue.params.id ? this.getAgentId() : {};
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
    test(num) {
      //console.log(num);
      //console.log(this.$route.query);
      /*this.$router.replace({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          test: num,
        },
      });*/
      /*this.query = {
          ...this.query,
          test: num,
        };*/
      this.route.query = {
        ...this.route.query,
        test: num,
      };
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
      <base-button
        slot="footer"
        type="primary"
        nativeType="button"
        @click="test(5)"
        link="true"
        fill
      >
        Click 4¡5
      </base-button>
      <base-button
        slot="footer"
        type="primary"
        nativeType="button"
        @click="test(4)"
        fill
      >
        Click 4
      </base-button>
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
