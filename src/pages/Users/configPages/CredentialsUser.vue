<script>
//import { store } from "@/stores/store";
import { useUsersStore } from "@/stores/usersStore";
import { useMessageStore } from "@/stores/messagesStore";
import { mapState, mapActions } from "pinia";

import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
export default {
  name: "CredentialsUser",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const credentialSchema = yup.object({
      openai_key: yup
        .string("Tienes que introducir texto.")
        .required("Esto es requerido para que funcione la aplicacion"),
      twilio_auth: yup
        .string("Tienes que introducir texto.")
        .required("Esto es requerido para que funcione la aplicacion"),
      twilio_account: yup
        .string("Tienes que introducir texto.")
        .required("Esto es requerido para que funcione la aplicacion"),
      twilio_service: yup
        .string("Tienes que introducir texto.")
        .required("Esto es requerido para que funcione la aplicacion"),
    });
    const databaseSchema = yup.object({
      db_host: yup
        .string("Tienes que introducir texto.")
        .required("Esto es requerido para que funcione la aplicacion"),
      db_pass: yup
        .string("Tienes que introducir texto.")
        .required("Esto es requerido para que funcione la aplicacion"),
      db_port: yup
        .string("Tienes que introducir texto.")
        .required("Esto es requerido para que funcione la aplicacion"),
      db_user: yup
        .string("Tienes que introducir texto.")
        .required("Esto es requerido para que funcione la aplicacion"),
      db_name: yup
        .string("Tienes que introducir texto.")
        .required("Esto es requerido para que funcione la aplicacion"),
    });
    const mailSchema = yup.object({
      mail_host: yup
        .string("Tienes que introducir texto.")
        .required("Esto es requerido para que funcione la aplicacion"),
      mail_pass: yup
        .string("Tienes que introducir texto.")
        .required("Esto es requerido para que funcione la aplicacion"),
      mail_port: yup
        .string("Tienes que introducir texto.")
        .required("Esto es requerido para que funcione la aplicacion"),
      mail_user: yup
        .string("Tienes que introducir texto.")
        .required("Esto es requerido para que funcione la aplicacion"),
      mail_recivers: yup
        .array("Tiene que ser un array.")
        .required("Esto es requerido para que funcione la aplicacion")
        .min(1, "Por lo menos debe de existir 1 recipiente"),
    });
    return {
      user: {},
      credentials: {},
      config: {},
      database: {},
      mail_settings: {},
      credentialSchema,
      databaseSchema,
      mailSchema,
    };
  },
  computed: {
    ...mapState(useUsersStore, {
      getUser: "getUser",
    }),
  },
  async mounted() {
    this.user = await this.getUser();
    this.config = this.user.config_user;
    this.database = this.config.database;
    this.credentials = this.config.credentials;
    this.mail_settings = this.config.mail_settings;
  },
  watch: {
    /*$route(newValue, oldValue) {
      newValue.params.id !== oldValue.params.id ? this.getBookId() : {};
    },*/
  },

  methods: {
    async modUserForm() {
      try {
        await this.modUser(this.user);
        this.$notify({
          icon: "tim-icons icon-check-2",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "primary",
          timeout: 30000,
          message: "Has modificado tu usuario",
        });
      } catch (error) {
        console.log("Error modificando usuario: " + JSON.stringify(error));
        this.$notify({
          icon: "tim-icons icon-alert-circle-exc",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "warning",
          timeout: 30000,
          message: error.data.detail,
        });
      }
      this.user = {};
      this.$router.push({ path: "/dashboard" });
      //window.location.reload();
    },
    controlForm() {
      this.user = {};
    },

    ...mapActions(useUsersStore, ["modUser"]),
  },
};
</script>

<template>
  <div class="login-page">
    <card>
      <h5 slot="header" class="title">Configuracion de las credenciales</h5>

      <Form
        class="form login-form"
        ref="loginForm"
        :v-model="user"
        :validation-schema="credentialSchema"
        @submit="modUserForm"
        @reset="controlForm"
      >
        <div>
          <base-input>
            <label for="openai_key">Openai Key</label>
            <Field
              name="openai_key"
              ref="openai_key"
              placeholder="Introduce apikey de openai"
              type="text"
              :class="[
                'form-control',
                {
                  'is-valid':
                    $refs.openai_key?.meta.valid &&
                    $refs.openai_key?.meta.touched,
                  'is-invalid':
                    $refs.openai_key?.meta.valid === false &&
                    $refs.openai_key?.meta.touched,
                },
              ]"
              v-model="credentials.OPENAI_API_KEY"
              required
            >
            </Field>
            <ErrorMessage class="invalid-feedback" name="openai_key" />
          </base-input>
        </div>
        <div>
          <base-input>
            <label for="twilio_auth">Twilio auth token</label>
            <Field
              name="twilio_auth"
              ref="twilio_auth"
              placeholder="Introduce el auth token de twilio"
              type="text"
              :class="[
                'form-control',
                {
                  'is-valid':
                    $refs.twilio_auth?.meta.valid &&
                    $refs.twilio_auth?.meta.touched,
                  'is-invalid':
                    $refs.twilio_auth?.meta.valid === false &&
                    $refs.twilio_auth?.meta.touched,
                },
              ]"
              v-model="credentials.TWILIO_AUTH_TOKEN"
              required
            >
            </Field>
            <ErrorMessage class="invalid-feedback" name="twilio_auth" />
          </base-input>
        </div>
        <div>
          <base-input>
            <label for="twilio_account">Twilio Account Id </label>
            <Field
              name="twilio_account"
              ref="twilio_account"
              placeholder="Introduce el id de la cuenta de twilio"
              type="text"
              :class="[
                'form-control',
                {
                  'is-valid':
                    $refs.twilio_account?.meta.valid &&
                    $refs.twilio_account?.meta.touched,
                  'is-invalid':
                    $refs.twilio_account?.meta.valid === false &&
                    $refs.twilio_account?.meta.touched,
                },
              ]"
              v-model="credentials.TWILIO_ACCOUNT_SID"
              required
            >
            </Field>
            <ErrorMessage class="invalid-feedback" name="twilio_account" />
          </base-input>
        </div>
        <div>
          <base-input>
            <label for="twilio_service">Twilio Service Id </label>
            <Field
              name="twilio_service"
              ref="twilio_service"
              placeholder="Introduce el id de la cuenta de twilio"
              type="text"
              :class="[
                'form-control',
                {
                  'is-valid':
                    $refs.twilio_service?.meta.valid &&
                    $refs.twilio_service?.meta.touched,
                  'is-invalid':
                    $refs.twilio_service?.meta.valid === false &&
                    $refs.twilio_service?.meta.touched,
                },
              ]"
              v-model="credentials.TWILIO_SERVICE_ID"
              required
            >
            </Field>
            <ErrorMessage class="invalid-feedback" name="twilio_service" />
          </base-input>
        </div>
        <base-button slot="footer" type="primary" nativeType="submit" fill
          >Finalizar edicion</base-button
        >
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
.card {
  width: 20% !important;
}
</style>
