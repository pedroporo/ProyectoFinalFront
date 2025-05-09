<script>
//import { store } from "@/stores/store";
import { useUsersStore } from "@/stores/usersStore";
import { useMessageStore } from "@/stores/messagesStore";
import { mapState, mapActions } from "pinia";

import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
export default {
  name: "UserLogin",
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
  },
  methods: {
    async loginUser() {
      try {
        //console.log("Hola");

        await this.login(this.user);
        this.$notify({
          icon: "tim-icons icon-check-2",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "primary",
          timeout: 30000,
          message: "Has iniciado sesion",
        });
      } catch (error) {
        console.log("Error iniciando sesion: " + JSON.stringify(error));
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
      this.$router.push({ path: "/" });
      //window.location.reload();
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
      <h5 slot="header" class="title">Login Form</h5>

      <Form
        class="form login-form"
        ref="loginForm"
        :v-model="user"
        :validation-schema="userSchema"
        @submit="loginUser"
        @reset="controlForm"
      >
        <div class="">
          <base-input>
            <label for="username">Username</label>
            <Field
              name="username"
              ref="username"
              placeholder="Introduce tu email o nombre de usuario"
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
              v-model="user.username"
              required
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
              v-model="user.password"
              type="password"
              required
            />

            <ErrorMessage class="invalid-feedback" name="password" />
          </base-input>
        </div>

        <base-button slot="footer" type="primary" nativeType="submit" fill
          >Iniciar sesion</base-button
        >
        <div class="flex-row">
          <base-button
            slot="footer"
            type="primary"
            class="google"
            nativeType="button"
            @click="loginGoogle"
            fill
          >
            <svg
              xml:space="preserve"
              style="enable-background: new 0 0 512 512"
              viewBox="0 0 512 512"
              y="0px"
              x="0px"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xmlns="http://www.w3.org/2000/svg"
              id="Layer_1"
              width="20"
              version="1.1"
            >
              <path
                d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
	c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
	C103.821,274.792,107.225,292.797,113.47,309.408z"
                style="fill: #fbbb00"
              ></path>
              <path
                d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
	c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
	c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"
                style="fill: #518ef8"
              ></path>
              <path
                d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
	c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
	c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"
                style="fill: #28b446"
              ></path>
              <path
                d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
	c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
	C318.115,0,375.068,22.126,419.404,58.936z"
                style="fill: #f14336"
              ></path>
            </svg>
            Google
          </base-button>
        </div>
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
