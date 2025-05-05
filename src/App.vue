<script>
import batoiLogo from "./assets/logoBatoi.png";
import AppMenu from "./components/Mios/AppMenu.vue";
import AppMesages from "./components/Mios/AppMessages.vue";

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
    await this.populateUser();
    this.$watch("$route", this.disableRTL, { immediate: true });
    this.$watch("$sidebar.showSidebar", this.toggleNavOpen);
  },
  data() {
    return {
      batoiLogo,
    };
  },
  methods: {
    ...mapActions(useUsersStore, ["populateUser"]),
    disableRTL() {
      if (!this.$rtl.isRTL) {
        this.$rtl.disableRTL();
      }
    },
    toggleNavOpen() {
      let root = document.getElementsByTagName("html")[0];
      root.classList.toggle("nav-open");
    },
  },
};
</script>

<template>
  <div>
    <notifications/>
    <router-view :key="$route.fullPath"></router-view>
  </div>

  
</template>

<style lang="scss">
/*@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css");
*/
</style>
