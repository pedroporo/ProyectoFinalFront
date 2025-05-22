<script>
import { useLlamadasStore } from "@/stores/llamadaStore";
import { mapState, mapActions } from "pinia";
import { Form, Field, ErrorMessage } from "vee-validate";

import * as yup from "yup";

export default {
  name: "call-form",
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
      call: {},
      route: this.$route,
      audioUrl: null,
      transcription: null,
    };
  },

  mounted() {
    //console.log(this.route.name);
    //Planeo hacer que si el nombre de la ruta es mod cargue la llamada y si no que la id la use para el agente
    if (this.route.name == "callMod") {
      this.call.id = this.route.params.id;
      this.getCallId();
      //this.agentId = this.$route.params.id;
    }else{
      this.call.agent_id = this.route.params.id;
    }

  },
  computed: {
    ...mapState(useLlamadasStore, {
      getCall: "getCall",
      getTranscript: "getTranscript",
      statuses: "status",
    }),
    callSchema() {
      const statusRegEx = new RegExp(`^(${this.statuses.join("|")})$`);
      return yup.object({
        contact_name: yup.string().required("El nombre del agente es obligatorio"),
        status: yup
          .string(
            "¿Eh?, Aqui solo puede ir texto, ¿como hiciste para meter algo que no sea texto?"
          )
          .required(
            "¿Por que no quieres seleccionar un estado? Tiene que haber uno para que el bot sepa que hacer"
          )
          .matches(
            statusRegEx,
            "Oye, solo se puede poner los estados que te damos. ¿Como te las arreglaste para meter algo que no sea eso?"
          ),
        phone_number: yup
          .string("Oye tienes que introducir texto aqui")
          .required("El telefono es obligatorio.")
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
    async submitCall() {
      try {
        if (!this.call.id) {
          await this.addCall(this.call);
        } else {
          await this.modCall(this.call);
        }
      } catch (error) {
        console.log(error);
      }
      this.call = {};
      this.$router.push({ path: "/dashboard" });
    },
    controlForm() {
      if (!this.call.id) {
        this.call = {};
      } else {
        this.getCallId();
      }
    },
    async getCallId() {
      try {
        this.$notify({
          icon: "tim-icons icon-zoom-split",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "primary",
          timeout: 3000,
          message: "Iniciando la busqueda de la llamada",
        });
        this.call = await this.getCall(this.$route.params.id);
        if (this.call.status == "completed") {
          //this.transcription = await this.getTranscript(this.call.call_id);
          await this.fetchRecording(this.call.call_id);
        }
      } catch (error) {
        console.log(error);

        const response = JSON.parse(error.request.response);
        this.$notify({
          icon: "tim-icons icon-alert-circle-exc",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "danger",
          timeout: 3000,
          message: response.detail,
        });
        this.$router.push({ path: "/dashboard" });
      }
    },
    async fetchRecording(callId) {
      try {
        const response = await this.getRecording(callId);
        //console.log(response);

        this.audioUrl = URL.createObjectURL(response.data);
      } catch (error) {
        this.audioUrl = null;
        this.$notify({
          icon: "tim-icons icon-alert-circle-exc",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "danger",
          timeout: 3000,
          message: "No se pudo cargar la grabación",
        });
      }
    },
    ...mapActions(useLlamadasStore, ["modCall", "addCall", "getRecording"]),
  },
  beforeUnmount() {
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
  },
};
</script>
<template>
  <div class="login-page">
    <card>
      <Form
        class="form login-form"
        ref="callForm"
        :v-model="call"
        :validation-schema="callSchema"
        @submit="submitCall"
        @reset="controlForm"
      >
        <div class="row">
          <div class="col ml-4">
            <div class="row">
              <h4>{{ $t("calls.contact_name") }}</h4>
            </div>
            <div class="row ml-4">
              <base-input>
              <Field
                name="contact_name"
                ref="contact_name"
                placeholder="Introduce el nombre del agente (opcional)"
                type="text"
                :class="[
                  'form-control',
                  {
                    'is-valid':
                      $refs.contact_name?.meta.valid &&
                      $refs.contact_name?.meta.touched,
                    'is-invalid':
                      $refs.contact_name?.meta.valid === false &&
                      $refs.contact_name?.meta.touched,
                  },
                ]"
                v-model="call.contact_name"
              >
              </Field>
              <ErrorMessage class="invalid-feedback" name="contact_name" />
            </base-input>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <h4>{{ $t("calls.phone_number") }}</h4>
            </div>
            <div class="row ml-4">
              <base-input>
              <Field
                name="phone_number"
                ref="phone_number"
                placeholder="Introduce el numero (+34123121212)"
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
                v-model="call.phone_number"
                required
              >
              </Field>
              <ErrorMessage class="invalid-feedback" name="phone_number" />
            </base-input>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <h4>{{ $t("calls.status") }}</h4>
            </div>
            <div class="row ml-4">
              <base-input>
              <Field
                name="status"
                ref="status"
                placeholder="Selecciona un estado"
                as="select"
                :class="[
                  'form-control custom-select ',
                  {
                    'is-valid':
                      $refs.status?.meta.valid && $refs.status?.meta.touched,
                    'is-invalid':
                      $refs.status?.meta.valid === false &&
                      $refs.status?.meta.touched,
                  },
                ]"
                v-model="call.status"
                required
              >
                <option default hidden class="form-option" value="">- Selecciona una voz -</option>
                <option v-for="estado in this.statuses" class="form-option" :value="estado">
                  {{ estado }}
                </option>
              </Field>
              <ErrorMessage class="invalid-feedback" name="voice" />
            </base-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col ml-4">
            <div class="row">
              <h4>{{ $t("calls.call_date") }}</h4>
            </div>
            <div class="row ml-4">
              <p>{{ this.call.call_date }}</p>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <h4>{{ $t("calls.call_duration") }}</h4>
            </div>
            <div class="row ml-4">
              <p>{{ this.call.call_duration }}</p>
            </div>
          </div>
          <div class="col" v-if="audioUrl">
            <div class="row">
              <h4>{{ $t("calls.recording") }}</h4>
            </div>
            <div class="row ml-4">
              <audio :src="audioUrl" controls style="width: 100%"></audio>
            </div>
          </div>
        </div>
        <div class="row" v-if="this.transcription">
          <div class="col ml-4">
            <div class="row">
              <h4>{{ $t("calls.transcript") }}</h4>
            </div>
            <div class="row ml-4">
              <p
                class="blockquote blockquote-info"
                style="white-space: pre-wrap"
              >
                {{ this.transcription.content }}
              </p>
            </div>
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
</style>
