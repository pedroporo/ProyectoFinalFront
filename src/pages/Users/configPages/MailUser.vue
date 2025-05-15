<script>
//import { store } from "@/stores/store";
import { useUsersStore } from "@/stores/usersStore";
import { useMessageStore } from "@/stores/messagesStore";
import { mapState, mapActions } from "pinia";

import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
export default {
  name: "DatabaseUser",
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
    addEmail() {
      if (!this.mail_settings.MAIL_RECIVERS) {
        this.$set(this.mail_settings, "MAIL_RECIVERS", []);
      }
      this.mail_settings.MAIL_RECIVERS.push("");
    },
    removeEmail(index) {
      if (this.mail_settings.MAIL_RECIVERS.length > 1) {
        this.mail_settings.MAIL_RECIVERS.splice(index, 1);
      }
    },
    ...mapActions(useUsersStore, ["modUser"]),
  },
};
</script>

<template>
  <div class="login-page">
    <card>
      <h5 slot="header" class="title">Configuracion de email</h5>

      <Form
        class="form login-form"
        ref="loginForm"
        :v-model="user"
        :validation-schema="mailSchema"
        @submit="modUserForm"
        @reset="controlForm"
      >
        <div>
          <base-input>
            <label for="mail_host">Url del servidor de mail</label>
            <Field
              name="mail_host"
              ref="mail_host"
              placeholder="Introduce un host para email"
              type="text"
              :class="[
                'form-control',
                {
                  'is-valid':
                    $refs.mail_host?.meta.valid &&
                    $refs.mail_host?.meta.touched,
                  'is-invalid':
                    $refs.mail_host?.meta.valid === false &&
                    $refs.mail_host?.meta.touched,
                },
              ]"
              v-model="mail_settings.MAIL_HOST"
              required
            >
            </Field>
            <ErrorMessage class="invalid-feedback" name="mail_host" />
          </base-input>
        </div>
        <div>
          <base-input>
            <label for="mail_port">Puerto del Mail</label>
            <Field
              name="mail_port"
              ref="mail_port"
              placeholder="Introduce un puerto para usar el mail"
              type="text"
              :class="[
                'form-control',
                {
                  'is-valid':
                    $refs.mail_port?.meta.valid &&
                    $refs.mail_port?.meta.touched,
                  'is-invalid':
                    $refs.mail_port?.meta.valid === false &&
                    $refs.mail_port?.meta.touched,
                },
              ]"
              v-model="mail_settings.MAIL_PORT"
              required
            >
            </Field>
            <ErrorMessage class="invalid-feedback" name="mail_port" />
          </base-input>
        </div>
        <div>
          <base-input>
            <label for="mail_user">Usuario</label>
            <Field
              name="mail_user"
              ref="mail_user"
              placeholder="Introduce el usuario que va a enviar los emails"
              type="text"
              :class="[
                'form-control',
                {
                  'is-valid':
                    $refs.mail_user?.meta.valid &&
                    $refs.mail_user?.meta.touched,
                  'is-invalid':
                    $refs.mail_user?.meta.valid === false &&
                    $refs.mail_user?.meta.touched,
                },
              ]"
              v-model="mail_settings.MAIL_USERNAME"
              required
            >
            </Field>
            <ErrorMessage class="invalid-feedback" name="mail_user" />
          </base-input>
        </div>
        <div>
          <base-input>
            <label for="mail_pass">Contraseña del email </label>
            <Field
              name="mail_pass"
              ref="mail_pass"
              :class="[
                'form-control',
                {
                  'is-valid':
                    $refs.mail_pass?.meta.valid &&
                    $refs.mail_pass?.meta.touched,
                  'is-invalid':
                    $refs.mail_pass?.meta.valid === false &&
                    $refs.mail_pass?.meta.touched,
                },
              ]"
              placeholder="Introduce la contraseña para que el bot pueda usar el email"
              v-model="mail_settings.MAIL_PASSWORD"
              type="password"
              required
            />

            <ErrorMessage class="invalid-feedback" name="mail_pass" />
          </base-input>
        </div>
        <div>
          <base-input>
            <label>Receptores de los emails</label>
            <div
              v-for="(email, index) in mail_settings.MAIL_RECIVERS"
              :key="index"
              style="display: flex; align-items: center; margin-bottom: 8px"
            >
              <Field
                type="text"
                :name="'reciver_' + index"
                style="flex: 1"
                placeholder="Introduce un email"
                class="form-control"
                v-model="mail_settings.MAIL_RECIVERS[index]"
              />

              
              <base-button
                type="danger"
                nativeType="button"
                size="sm"
                style="margin-left: 8px"
                @click="removeEmail(index)"
                v-if="mail_settings.MAIL_RECIVERS.length > 1"
              >
                Quitar
              </base-button>
            </div>
            <base-button
              type="primary"
              nativeType="button"
              size="sm"
              style="margin-top: 8px"
              @click="addEmail"
            >
              Añadir receptor
            </base-button>
            <ErrorMessage class="invalid-feedback" name="mail_recivers" />
          </base-input>
        </div>
        <base-button slot="footer" type="primary" nativeType="submit" fill>
          Finalizar edicion
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
.card {
  width: 20% !important;
}
</style>
