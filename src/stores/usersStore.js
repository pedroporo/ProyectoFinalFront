import { defineStore } from "pinia";
import api from "./api.js";

export const useUsersStore = defineStore("userStore", {
  state() {
    return {
      user: {},
    };
  },
  getters: {
    getuser: (state) => async () => (await api.users.getAll()).data,
  },
  actions: {
    async populateUser() {
      if (!localStorage.usuario || localStorage.usuario == "{}") {
        localStorage.usuario = JSON.stringify(this.user);
      }
      if (localStorage.usuario) {
        this.user = JSON.parse(localStorage.usuario);
      }
      //const response = await api.users.getAll();
      //console.log("UserGet: " + response.request?.response);
      //this.user = JSON.parse(response.request?.response);
    },

    async login(usuario) {
      try {
        //console.log("Usuario:"+usuario);

        const response = await api.users.login(usuario);
        //console.log("Response: "+ response.data[0]);
        //console.log("Request: "+ response.request?.response);
        this.token = JSON.parse(response.request?.response);
        //console.log("Token: "+this.token);
        console.log("Cookies: " + this.token);
        this.setCookie("access_token", this.token.access_token, 30);
        //document.cookie = "access_token=" + this.token.access_token;
        //localStorage.usuario = JSON.stringify(this.user);
        const respo = await api.users.getAll();
        //console.log("UserGet: "+respo);

        this.user = JSON.parse(respo.request?.response);
        delete this.user.password;
        delete this.user.role;
        delete this.user.dissabled;
        localStorage.usuario = JSON.stringify(this.user);
        await this.populateUser()
      } catch (response) {
        console.error("Error: " + response.message);
      }
    },
    async logout() {
      try {
        //const response=(await api.users.logout()).request?.response;
        let response = await api.users.logout();
        response=response.request?.response
        this.user = {};

        document.cookie =
          "access_token=" + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        localStorage.usuario = JSON.stringify(this.user);
        //console.log("Logout Response: " + response);
        await this.populateUser()
        return response;
      } catch (response) {
        console.error("Error: " + response.message);
      }
    },
    async setCookie(cname, cvalue, exdays) {
      const d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      let expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },

    async getCookieUser(cname) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${cname}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    },
    async checkCookies(cname) {
      let cookie = this.getCookieUser(cname);
      print("Cookie exists: " + cookie);
      return cookie != "" ? true : false;
    },
  },
});
