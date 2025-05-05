import { createRouter, createWebHistory } from 'vue-router';
import DashboardLayout from "../layout/starter/SampleLayout.vue";
import Starter from "../layout/starter/SamplePage.vue";
import routes from "./routes";
//const routes = [
//  {
//    path: "/",
//    name: "home",
//    redirect: "/dashboard",
//    component: DashboardLayout,
//    children: [
//      {
//        path: "dashboard",
//        name: "dashboard",
//        component: Starter, // Nota: en Vue Router 4 se usa 'component', no 'components'
//      },
//    ],
//  },
//];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Puedes usar createWebHashHistory() si prefieres hash mode
  routes,
  linkExactActiveClass: "active",
  scrollBehavior: (to) => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  },
});

export default router;
