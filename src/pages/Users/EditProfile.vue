<script>
//import { store } from "@/stores/store";
import { useUsersStore } from "@/stores/usersStore";
import { useMessageStore } from "@/stores/messagesStore";
import { mapState, mapActions } from "pinia";

import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
export default {
  name: "EditProfile",
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
      email: yup
        .string()
        .email("Tienes que ser un formato de email valido")
        .required("Tienes que introducir un email."),
      password: yup.string().required("Introduce la contraseña"),
    });
    return {
      userForm: {},
      userSchema,
      imageDefault: "",
    };
  },
  computed: {
    ...mapState(useUsersStore, {
      user: "user",
      getUser: "getUser",
    }),
  },
  async mounted() {
    this.userForm = await this.getUser();
    this.userForm.password=undefined
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
      <h5 slot="header" class="title">Perfil del usuario</h5>

      <Form
        class="form login-form"
        ref="loginForm"
        :v-model="userForm"
        :validation-schema="userSchema"
        @submit="modUserForm"
        @reset="controlForm"
      >
        <div class="">
          <base-input>
            <label for="username">Email</label>
            <Field
              name="email"
              ref="email"
              placeholder="Introduce el email"
              type="text"
              :class="[
                'form-control',
                {
                  'is-valid':
                    $refs.email?.meta.valid && $refs.email?.meta.touched,
                  'is-invalid':
                    $refs.email?.meta.valid === false &&
                    $refs.email?.meta.touched,
                },
              ]"
              v-model="userForm.email"
              required
            >
            </Field>
            <ErrorMessage class="invalid-feedback" name="email" />
          </base-input>
        </div>
        <div class="">
          <base-input>
            <label for="username">Username</label>
            <Field
              name="username"
              ref="username"
              placeholder="Introduce el nombre de usuario"
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
              v-model="userForm.username"
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
              placeholder="Introduce tu contraseña actual para poder modificar el usuario"
              v-model="userForm.password"
              value=""
              type="password"
              required
            />

            <ErrorMessage class="invalid-feedback" name="password" />
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
