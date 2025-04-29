<script>
import batoiLogo from "./assets/logoBatoi.png";
import AppMenu from "./components/AppMenu.vue";
import AppMesages from "./components/AppMessages.vue";

import { useUsersStore } from "./stores/usersStore";
import AboutView from "./views/AboutView.vue";
//import { store } from "./stores/store";
/*import { useBooksStore } from "./stores/bookStore";
import { useModulesStore } from "./stores/modulesStore";
import { useCartStore } from "./stores/carritoStore";*/
import { mapState, mapActions } from "pinia";
export default {
  name: "App",
  components: {
    AppMenu,
    AppMesages,

    AboutView,
  },
  async mounted() {
    /*await this.populateBooks();
    await this.populateModules();
    this.populateCart();*/
    //await this.populateUser()
  },
  data() {
    return {
      batoiLogo,
    };
  },
  methods: {
    //...mapActions(useUsersStore, ['populateUser']),
  },
};
</script>

<template>
  <app-menu></app-menu>
  <app-mesages></app-mesages>
  <router-view></router-view>
</template>

<style>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css");

</style>
