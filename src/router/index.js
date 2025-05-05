import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import BookList from "@/components/Mios/BookList.vue";
import PathNotFound from "@/components/Mios/PathNotFound.vue";
import AddBook from "@/components/Mios/AddBook.vue";
import AboutView from "../views/AboutView.vue";
import AddCart from "@/components/Mios/AddCart.vue";
import UserLogin from "@/components/Mios/UserLogin.vue";



// Admin pages
const Dashboard = () =>
  import(/* webpackChunkName: "dashboard" */ "@/pages/Dashboard.vue");
const Profile = () =>
  import(/* webpackChunkName: "common" */ "@/pages/Profile.vue");
const Notifications = () =>
  import(/* webpackChunkName: "common" */ "@/pages/Notifications.vue");
const Icons = () =>
  import(/* webpackChunkName: "common" */ "@/pages/Icons.vue");
const Maps = () => import(/* webpackChunkName: "common" */ "@/pages/Maps.vue");
const Typography = () =>
  import(/* webpackChunkName: "common" */ "@/pages/Typography.vue");
const TableList = () =>
  import(/* webpackChunkName: "common" */ "@/pages/TableList.vue");
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      children: [
        {
          path: "dashboard",
          name: "dashboard",
          component: Dashboard,
        },
        {
          path: "profile",
          name: "profile",
          component: Profile,
        },
        {
          path: "notifications",
          name: "notifications",
          component: Notifications,
        },
        {
          path: "icons",
          name: "icons",
          component: Icons,
        },
        {
          path: "typography",
          name: "typography",
          component: Typography,
        },
        {
          path: "table-list",
          name: "table-list",
          component: TableList,
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: UserLogin,
    },
    {
      path: "/list",
      name: "list",
      component: BookList,
    },
    {
      path: "/addBook",
      name: "addBook",
      component: AddBook,
    },
    {
      path: "/cart",
      name: "carrito",
      component: AddCart,
    },
    {
      path: "/edit/:id",
      name: "edit",
      component: AddBook,
      props: true,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
    {
      path: "/:pathMatch(.*)*",
      component: PathNotFound,
    },
  ],
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
