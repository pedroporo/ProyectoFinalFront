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
        :validation-schema="databaseSchema"
        @submit="modUserForm"
        @reset="controlForm"
      >
        <div>
          <base-input>
            <label for="db_host">Host DB</label>
            <Field
              name="db_host"
              ref="db_host"
              placeholder="Introduce un host para la base de datos"
              type="text"
              :class="[
                'form-control',
                {
                  'is-valid':
                    $refs.db_host?.meta.valid &&
                    $refs.db_host?.meta.touched,
                  'is-invalid':
                    $refs.db_host?.meta.valid === false &&
                    $refs.db_host?.meta.touched,
                },
              ]"
              v-model="database.DB_HOST"
              required
            >
            </Field>
            <ErrorMessage class="invalid-feedback" name="db_host" />
          </base-input>
        </div>
        <div>
          <base-input>
            <label for="db_name">Nombre de la base</label>
            <Field
              name="db_name"
              ref="db_name"
              placeholder="Introduce el nombre de la base de datos"
              type="text"
              :class="[
                'form-control',
                {
                  'is-valid':
                    $refs.db_name?.meta.valid &&
                    $refs.db_name?.meta.touched,
                  'is-invalid':
                    $refs.db_name?.meta.valid === false &&
                    $refs.db_name?.meta.touched,
                },
              ]"
              v-model="database.DATABASE_NAME"
              required
            >
            </Field>
            <ErrorMessage class="invalid-feedback" name="db_name" />
          </base-input>
        </div>
        <div>
          <base-input>
            <label for="db_port">Puerto de la base de datos</label>
            <Field
              name="db_port"
              ref="db_port"
              placeholder="Introduce un puerto para la base de datos (3306)"
              type="text"
              :class="[
                'form-control',
                {
                  'is-valid':
                    $refs.db_port?.meta.valid &&
                    $refs.db_port?.meta.touched,
                  'is-invalid':
                    $refs.db_port?.meta.valid === false &&
                    $refs.db_port?.meta.touched,
                },
              ]"
              v-model="database.DB_PORT"
              required
            >
            </Field>
            <ErrorMessage class="invalid-feedback" name="db_port" />
          </base-input>
        </div>
        <div>
          <base-input>
            <label for="db_user">Usuario de la base de datos </label>
            <Field
              name="db_user"
              ref="db_user"
              placeholder="Introduce un usuario para la base de datos"
              type="text"
              :class="[
                'form-control',
                {
                  'is-valid':
                    $refs.db_user?.meta.valid &&
                    $refs.db_user?.meta.touched,
                  'is-invalid':
                    $refs.db_user?.meta.valid === false &&
                    $refs.db_user?.meta.touched,
                },
              ]"
              v-model="database.DB_USER"
              required
            >
            </Field>
            <ErrorMessage class="invalid-feedback" name="db_user" />
          </base-input>
        </div>
        <div>
          <base-input>
            <label for="db_pass">Contraseña de la base de datos </label>
            <Field
              name="db_pass"
              ref="db_pass"
              :class="[
                'form-control',
                {
                  'is-valid':
                    $refs.db_pass?.meta.valid && $refs.db_pass?.meta.touched,
                  'is-invalid':
                    $refs.db_pass?.meta.valid === false &&
                    $refs.db_pass?.meta.touched,
                },
              ]"
              placeholder="Introduce la contraseña para la base de datos"
              v-model="database.DB_PASS"
              type="password"
              required
            />

            <ErrorMessage class="invalid-feedback" name="db_pass" />
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
