<script>
//import { store } from "@/stores/store";
import { useUsersStore } from "@/stores/usersStore";
import { useAgentsStore } from "@/stores/agentsStore";
import { useMessageStore } from "@/stores/messagesStore";
import { mapState, mapActions } from "pinia";

import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
export default {
  name: "Test",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const userSchema = yup.object({
      username: yup
        .string()
        .required("Tienes que introducir un email o nombre de usuario"),
      password: yup.string().required("Introduce la contraseña"),
    });
    return {
      user: {},
      userSchema,
      imageDefault: "",
    };
  },
  mounted() {},
  watch: {
    /*$route(newValue, oldValue) {
      newValue.params.id !== oldValue.params.id ? this.getBookId() : {};
    },*/
  },
  computed: {
    /*...mapState(useBooksStore, {
      states: "states",
      getBook: "getBook",
      bExists: "bExists",
    }),*/
    ...mapState(useAgentsStore, {
      voces: "voces",
    }),
  },
  methods: {
    async loginUser() {
      try {
        console.log("HOla");
        
        console.log(user.file);
      } catch (error) {
        console.log("Error iniciando sesion: " + JSON.stringify(error));
        this.$notify({
          icon: "tim-icons icon-alert-circle-exc",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "warning",
          timeout: 30,
          message: error.data.detail,
        });
      }
    },
    async loginGoogleUser() {
      try {
        await this.loginGoogle();
      } catch (error) {
        console.log("Error iniciando sesion: " + JSON.stringify(error));
        this.$notify({
          icon: "tim-icons icon-alert-circle-exc",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "warning",
          timeout: 30,
          message: error.data.detail,
        });
      }
      this.user = {};
      this.$router.push({ path: "/" });
      //window.location.reload();
    },
    controlForm() {
      this.user = {};
    },

    ...mapActions(useUsersStore, ["login", "loginGoogle"]),
    ...mapActions(useMessageStore, ["addMessage"]),
  },
};
</script>

<template>
  <div class="login-page">
    <card>
      <h5 slot="header" class="title">Test Form</h5>

      <Form
        class="form login-form"
        ref="loginForm"
        :v-model="user"
        @submit="loginUser"
        @reset="controlForm"
        style=""
      >
        <div class="">
          <base-input-file
          fileText="Haz click aqui para subir el archivo"
          >
            <label class="control-label control-file-label" for="file">Haz click aqui para subir el archivo</label>
            <Field
              name="file"
              ref="callcsv"
              placeholder="Introduce tu email o nombre de usuario"
              type="file"
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
              accept=".pdf"
              v-model="user.file"
              required
            >
            </Field>
            <ErrorMessage class="invalid-feedback" name="callcsv" />
          </base-input-file>
          <base-input>
            <label for="voces">Selecciona la voz que tendra el agente</label>
            <Field
              name="voces"
              ref="callcsv"
              placeholder="Introduce tu email o nombre de usuario"
              as="select"
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
              v-model="user.voz"
              required
            >
            <option default hidden value="">- Selecciona un módulo -</option>
          <option v-for="voz in this.vpces" :value="voz">
            {{ voz }}
          </option>
            </Field>
            <ErrorMessage class="invalid-feedback" name="voces" />
          </base-input>
        </div>
        <base-button slot="footer" type="primary" nativeType="submit" fill>
          Enviar
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
