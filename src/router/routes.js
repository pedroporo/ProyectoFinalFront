import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
import HomeView from "../views/HomeView.vue";
// GeneralViews
import NotFound from "@/pages/paginas_muestra/NotFoundPage.vue";
import Starter from "../layout/starter/SamplePage.vue";
//import UserLogin from "@/components/Mios/UserLogin.vue";
import UserLogin from "@/pages/UserLogin.vue";
import AgentTable from "@/pages/Agentes/AgentTable.vue";
import AgentItem from "@/pages/Agentes/AgentItem.vue";
import Test from "@/pages/Test.vue";
// Admin pages
const Dashboard = () =>
  import(
    /* webpackChunkName: "dashboard" */ "@/pages/paginas_muestra/Dashboard.vue"
  );
const Profile = () =>
  import(
    /* webpackChunkName: "common" */ "@/pages/paginas_muestra/Profile.vue"
  );
const Notifications = () =>
  import(
    /* webpackChunkName: "common" */ "@/pages/paginas_muestra/Notifications.vue"
  );
const Icons = () =>
  import(/* webpackChunkName: "common" */ "@/pages/paginas_muestra/Icons.vue");
const Maps = () =>
  import(/* webpackChunkName: "common" */ "@/pages/paginas_muestra/Maps.vue");
const Typography = () =>
  import(
    /* webpackChunkName: "common" */ "@/pages/paginas_muestra/Typography.vue"
  );
const TableList = () =>
  import(
    /* webpackChunkName: "common" */ "@/pages/paginas_muestra/TableList.vue"
  );

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    name: "home",

    children: [
      {
        path: "login",
        name: "login",
        component: UserLogin,
        meta: {
          requiresAuth: false,
          hideForAuth: true,
        },
      },
      {
        path: "dashboard",
        name: "dashboard",
        component: AgentTable,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "profile",
        name: "profile",
        component: Profile,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "agents",
        name: "agentCreate",
        component: AgentItem,
        meta: {
          requiresAuth: true,
        },
        children:[
          {
            path: ":id",
            name: "agentMod",
            component: AgentItem,
            props: true,
          },
        ]
      },
      
      {
        path: "notifications",
        name: "notifications",
        component: Notifications,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "icons",
        name: "icons",
        component: Icons,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "maps",
        name: "maps",
        component: Maps,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "typography",
        name: "typography",
        component: Typography,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "table-list",
        name: "table-list",
        component: TableList,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "test",
        name: "test",
        component: Test,
        meta: {
          requiresAuth: false,
        },
      },
    ],
  },

  { path: "/:pathMatch(.*)*", component: NotFound },
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
