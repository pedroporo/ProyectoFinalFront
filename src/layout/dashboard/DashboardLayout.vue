<template>
  <div class="wrapper">
    <side-bar>
      <template v-slot="links">
        <sidebar-link
          to="/dashboard"
          :name="$t('sidebar.dashboard')"
          icon="tim-icons icon-chart-pie-36"
          :rname=$route.path
        />
        <!--<sidebar-link
          to="/icons"
          :name="$t('sidebar.icons')"
          icon="tim-icons icon-atom"
          :rname=$route.path
        />
        <sidebar-link
          to="/notifications"
          :name="$t('sidebar.notifications')"
          icon="tim-icons icon-bell-55"
          :rname=$route.path
        />
        <sidebar-link
          to="/profile"
          :name="$t('sidebar.userProfile')"
          icon="tim-icons icon-single-02"
          :rname=$route.path
        />
        <sidebar-link
          to="/table-list"
          :name="$t('sidebar.tableList')"
          icon="tim-icons icon-puzzle-10"
          :rname=$route.path
        />
        <sidebar-link
          to="/typography"
          :name="$t('sidebar.typography')"
          icon="tim-icons icon-align-center"
          :rname=$route.path
        />
        <sidebar-link
          to="/test"
          :name="$t('sidebar.test')"
          icon="tim-icons icon-align-center"
          :rname=$route.path
        />-->
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click="toggleSidebar"> </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss"></style>
<script>
import { getCurrentInstance } from 'vue';
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu.vue";
export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
  },
  methods: {
    toggleSidebar() {
      /*const { proxy } = getCurrentInstance();
      if (proxy.$sidebar && proxy.$sidebar.showSidebar) {
        proxy.$sidebar.displaySidebar(false);
      }*/
    },
  },
};
</script>
