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
    /*const agentSchema = yup.object({
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
          (d),
          "Oye, solo se puede poner las voces que te damos. ¿Como te las arreglaste para meter algo que no sea eso?"
        ),
        phone_number: yup.string().required().matches(/^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,"Tienes que introducir un formato de numero de telefono valido EJ (+34123123123)")
    });*/
    return {
      agent: JSON.parse(localStorage.getItem("agentState")) || this.item || {},
      //agentSchema,
      route: this.$route,
      agentId: this.$route.params.id,
      query: this.$route.query,
      regex: `/()/`,
    };
  },

  mounted() {
    if (
      !JSON.parse(localStorage.getItem("agentState")) &&
      this.$route.params.id
    ) {
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
    agentSchema() {
      const voicesRegex = new RegExp(`^(${this.voces.join("|")})$`);
      return yup.object({
        name: yup.string().required("El nombre del agente es obligatorio"),
        voice: yup
          .string(
            "¿Eh?, Aqui solo puede ir texto, ¿como hiciste para meter algo que no sea texto?"
          )
          .required(
            "¿Por que no quieres seleccionar una voz?¿Como piensas que se comunique?"
          )
          .matches(
            voicesRegex,
            "Oye, solo se puede poner las voces que te damos. ¿Como te las arreglaste para meter algo que no sea eso?"
          ),
        phone_number: yup
          .string("Oye tienes que introducir texto aqui")
          .required("El telefono es obligatorio, asi es como va a llamar")
          .matches(
            /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
            "Tienes que introducir un formato de numero de telefono valido EJ (+34123123123)"
          ),
      });
    },
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
    async addAgentForm() {
      try {
        if (!this.agent.id) {
          await this.addAgent(this.agent);
        } else {
          await this.modAgent(this.agent);
        }
      } catch (error) {
        console.log(error);
      }
      this.agent = {};
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
        @submit="addAgentForm"
        @reset="controlForm"
      >
        <div class="row">
          <div class="col-md-6 pr-md-1">
            <base-input>
              <label for="name">Nombre</label>
              <Field
                name="name"
                ref="name"
                placeholder="Introduce el nombre del agente (opcional)"
                type="text"
                :class="[
                  'form-control',
                  {
                    'is-valid':
                      $refs.name?.meta.valid &&
                      $refs.name?.meta.touched,
                    'is-invalid':
                      $refs.name?.meta.valid === false &&
                      $refs.name?.meta.touched,
                  },
                ]"
                v-model="agent.name"
              >
              </Field>
              <ErrorMessage class="invalid-feedback" name="name" />
            </base-input>
          </div>
          <div class="col-md-6 pr-md-1">
            <base-input>
              <label for="voice">Selecciona la voz que tendra el agente</label>
              <Field
                name="voice"
                ref="voice"
                placeholder="Selecciona una voz"
                as="select"
                :class="[
                  'form-control custom-select ',
                  {
                    'is-valid':
                      $refs.voice?.meta.valid && $refs.voice?.meta.touched,
                    'is-invalid':
                      $refs.voice?.meta.valid === false &&
                      $refs.voice?.meta.touched,
                  },
                ]"
                v-model="agent.voice"
                required
              >
                <option default class="form-option" hidden value="">- Selecciona una voz -</option>
                <option v-for="voz in this.voces" class="form-option" :value="voz">
                  {{ voz }}
                </option>
              </Field>
              <ErrorMessage class="invalid-feedback" name="voice" />
            </base-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 pr-md-1">
            <base-input>
              <label for="phone_number"
                >Numero de telefono del agente (Necesitas vericicarlo en
                twilio)</label
              >
              <Field
                name="phone_number"
                ref="phone_number"
                placeholder="Introduce el numero del agente (opcional)"
                type="text"
                :class="[
                  'form-control',
                  {
                    'is-valid':
                      $refs.phone_number?.meta.valid &&
                      $refs.phone_number?.meta.touched,
                    'is-invalid':
                      $refs.phone_number?.meta.valid === false &&
                      $refs.phone_number?.meta.touched,
                  },
                ]"
                v-model="agent.phone_number"
                required
              >
              </Field>
              <ErrorMessage class="invalid-feedback" name="phone_number" />
            </base-input>
          </div>
          <div class="col-md-6 pr-md-1">
            <base-input>
              <label for="descripcion"
                >Descripcion interna del agente (Opcional)</label
              >
              <Field
                name="descripcion"
                ref="descripcion"
                placeholder="Introduce la descrippcion del agente"
                type="text"
                as="textarea"
                rows="4"
                cols="80"
                :class="[
                  'form-control',
                  {
                    'is-valid':
                      $refs.descripcion?.meta.valid &&
                      $refs.descripcion?.meta.touched,
                    'is-invalid':
                      $refs.descripcion?.meta.valid === false &&
                      $refs.descripcion?.meta.touched,
                  },
                ]"
                v-model="agent.descripcion"
              >
              </Field>
              <ErrorMessage class="invalid-feedback" name="descripcion" />
            </base-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <base-input>
              <label for="instrucciones">Instrucciones del agente</label>
              <Field
                name="instrucciones"
                ref="instrucciones"
                placeholder="Introduce las instrucciones del agente"
                type="text"
                as="textarea"
                rows="20"
                cols="80"
                :class="[
                  'form-control instrucciones',
                  {
                    'is-valid':
                      $refs.instrucciones?.meta.valid &&
                      $refs.instrucciones?.meta.touched,
                    'is-invalid':
                      $refs.instrucciones?.meta.valid === false &&
                      $refs.instrucciones?.meta.touched,
                  },
                ]"
                v-model="agent.instrucciones"
                required
              >
              </Field>
              <ErrorMessage class="invalid-feedback" name="instrucciones" />
            </base-input>
          </div>
          <div class="col-md-4">
            <p class="description">
              El agente por defecto va a empezar a hablar el cuando empieze la
              llamada, va a tener una creatividad de 0,6 va a colgar si no
              detecta sonido en 30 segundos y el tiempo maximo de llamada es 3
              minutos
            </p>
          </div>
        </div>

        <base-button slot="footer" type="primary" is="submit" nativeType="submit" fill>
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
.instrucciones {
  max-height: none;
}
</style>
