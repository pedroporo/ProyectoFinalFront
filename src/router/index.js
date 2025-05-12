import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import routes from "./routes";
import BookList from "@/components/Mios/BookList.vue";
import PathNotFound from "@/components/Mios/PathNotFound.vue";
import AddBook from "@/components/Mios/AddBook.vue";
import AboutView from "../views/AboutView.vue";
import AddCart from "@/components/Mios/AddCart.vue";
import UserLogin from "@/components/Mios/UserLogin.vue";
import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
import { useUsersStore } from "@/stores/usersStore";
import { mapState, mapActions } from "pinia";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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

router.beforeEach((to, from, next) => {
  //console.log(to);
  if (!to.query.segmento) {
    localStorage.removeItem('agentState');
  }
  if (to.name === "login") {
    //console.log("Login");
    checkIfHidden(to, next);
  } else if (to.meta && to.meta.requiresAuth === false) {
    //console.log("No need auth");

    checkIfHidden(to, next);
  } else if (checkCookies("access_token")) {
    //console.log("Token");
    checkIfHidden(to, next);
  } else {
    //console.log("Else");

    next({ name: "login" });
  }
});
function checkIfHidden(to, next) {
  //console.log(to.matched.some((record) => record.meta.hideForAuth));

  if (to.matched.some((record) => record.meta.hideForAuth)) {
    if (checkCookies("access_token")) {
      next({ name: "dashboard" });
    } else {
      next();
    }
  } else {
    next();
  }
}
function getCookie(cname) {
  const value = `; ${document.cookie}`;
  //console.log(value);

  const parts = value.split(`; ${cname}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
function checkCookies(cname) {
  let cookie = getCookie(cname);
  const check = cookie != "" && cookie ? true : false;
  const store = useUsersStore();
  store.loggedIn = check;
  return check;
}
export default router;
