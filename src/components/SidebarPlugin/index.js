import Sidebar from "./SideBar.vue";
import SidebarLink from "./SidebarLink.vue";
import { reactive } from 'vue';

const SidebarStore = reactive({
  showSidebar: false,
  sidebarLinks: [],
  displaySidebar(value) {
    this.showSidebar = value;
  },
});

const SidebarPlugin = {
  install(app) { 
    app.config.globalProperties.$sidebar = SidebarStore;
    
    // Registra los componentes
    app.component("side-bar", Sidebar);
    app.component("sidebar-link", SidebarLink);
  },
};

export default SidebarPlugin;
