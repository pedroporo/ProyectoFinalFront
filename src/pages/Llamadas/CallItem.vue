<script>
import { useLlamadasStore } from "@/stores/llamadaStore";
import { mapState, mapActions } from "pinia";
import { useUsersStore } from "@/stores/usersStore";

import * as yup from "yup";

export default {
  name: "call-form",
  props: ["item"],
  emits:["unmounted"],
  components: {},
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
      call: this.item || {},
      audioUrl: null,
      route: this.$route,
      agentId: this.$route.params.id,
      query: this.$route.query,
    };
  },

  mounted() {
    if (this.item.id) {
      this.getCallId();
      //this.agentId = this.$route.params.id;
    }
  },
  computed: {
    ...mapState(useLlamadasStore, {
      getCall: "getCall",
      getTranscript: "getTranscript",
    }),
    ...mapState(useUsersStore, {
      user: "user",
    }),
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
        this.call = await this.getCall(this.item.id);
        //console.log(this.call);

        if (this.call.status == "completed") {
          this.call.transcript = await this.getTranscript(this.call.call_id);
          //console.log(await this.getTranscript(this.call.call_id));

          await this.fetchRecording(this.call.call_id);
        }
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
        this.$router.push({ path: "/" });
      }
    },
    async fetchRecording(callId) {
      try {
        // Cambia la URL según tu backend
        const response = await this.getRecording(callId);
        // Crear un objeto URL para el blob
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
    this.$emit('unmounted', this.call)
    
  },
};
</script>
<template>
  <div class="login-page">
    <card>
      <div class="row">
        <div class="col ml-4">
          <div class="row">
            <h4>{{ $t("calls.contact_name") }}</h4>
          </div>
          <div class="row ml-4">
            <p>{{ this.call.contact_name }}</p>
          </div>
        </div>
        <div class="col">
          <div class="row">
            <h4>{{ $t("calls.phone_number") }}</h4>
          </div>
          <div class="row ml-4">
            <p>{{ this.call.phone_number }}</p>
          </div>
        </div>
        <div class="col">
          <div class="row">
            <h4>{{ $t("calls.status") }}</h4>
          </div>
          <div class="row ml-4">
            <p>{{ this.call.status }}</p>
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
      <div class="row" v-if="this.call.transcript">
        <div class="col ml-4">
          <div class="row">
            <h4>{{ $t("calls.transcript") }}</h4>
          </div>
          <div class="row ml-4">
            <p class="blockquote blockquote-info" style="white-space: pre-wrap">
              {{ this.call.transcript.content }}
            </p>
          </div>
        </div>
      </div>
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
