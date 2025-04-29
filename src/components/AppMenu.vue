<script>
import { useMessageStore } from "@/stores/messagesStore";
import { mapState, mapActions } from "pinia";
import { useUsersStore } from "@/stores/usersStore";
export default {
  name: "AppMenu",
  data() {
    return {
      imageDefault: "https://picsum.photos/200.jpg",
      isNavVisible: false,
      cookie: document.cookie.split(`; access_token=`)[0],
      //userDataAvatar: JSON.parse(localStorage.getItem('usuario')).avatar || null,
    };
  },

  computed: {
    /*cookie() {
      return document.cookie.split(`; access_token=`)[0];
    },*/
  },
  watch: {
    $cookie(newValue, oldValue) {
      newValue !== oldValue ? this.cookie : window.location.reload();
    },
  },
  methods: {
    toggleNav() {
      this.isNavVisible = !this.isNavVisible;
    },
    closeNavOnMobile() {
      if (window.innerWidth <= 768) {
        this.isNavVisible = false;
      }
    },
    async cerrarSesion() {
      console.log("Intentando cerrar sesion");
      
      if (await this.logout()) {
        this.addMessage("success","Sesión cerrada exitosamente");
        this.cookie=null
        //window.location.reload()
      }
    },
    ...mapActions(useMessageStore, ["addMessage"]),
    ...mapActions(useUsersStore, ["logout"]),
  },
};
</script>
<template>
  <div class="sidebar">
    <div class="header-content">
      <img
        v-if="userDataAvatar"
        :src="userDataAvatar"
        alt="Avatar"
        class="avatar"
      />
      <img velse :src="imageDefault" alt="Avatar" class="avatar" />
      <h1>Chatbot 2</h1>
    </div>
    <button @click="toggleNav" class="toggle-nav-btn">
      <i class="bi bi-list"></i>
    </button>
    <nav class="nav" :class="{ 'nav-visible': isNavVisible }">
      <RouterLink to="/cuenta" @click="closeNavOnMobile">Mi Cuenta</RouterLink>
      <RouterLink to="/patients" @click="closeNavOnMobile"
        >Listado de Pacientes</RouterLink
      >
      <RouterLink to="/incoming_calls" @click="closeNavOnMobile"
        >Llamadas Entrantes</RouterLink
      >
      <RouterLink to="/outgoing_calls" @click="closeNavOnMobile"
        >Llamadas Salientes</RouterLink
      >
      <!-- <RouterLink to="/gestionUsers" @click="closeNavOnMobile">Listado de Operadores</RouterLink> -->
      <RouterLink to="/informes" @click="closeNavOnMobile">Informes</RouterLink>

      <RouterLink
        v-if="cookie"
        to="/"
        @click="cerrarSesion(), closeNavOnMobile()"
        >Cerrar Sesión</RouterLink
      >

      <RouterLink v-else to="/login" @click="closeNavOnMobile()"
        >Iniciar Sesión</RouterLink
      >

      <LoginGoogle />
    </nav>
  </div>
</template>
<style scoped>
/* Estilos generales del sidebar */
.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: #007bff;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.avatar {
  margin-right: 10px;
  border-radius: 15%;
  width: 32px;
  display: block;
  margin-bottom: 4px;
}

h1 {
  font-size: 28px;
  font-weight: 700;
}

.toggle-nav-btn {
  background: none;
  border: none;
  color: white;
  font-size: 32px;
  /* Increased font size */
  cursor: pointer;
  padding: 0;
  display: none;
  /* Ocultar por defecto */
}

/* Navegación */
nav {
  display: flex;
  flex-direction: column;
  width: 100%;
}

nav a {
  text-decoration: none;
  color: white;
  padding: 12px 15px;
  border-radius: 5px;
  margin-bottom: 8px;
  font-size: 16px;
  transition: background 0.3s;
}

nav a:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Contenido principal con margen para que no se solape con el sidebar */
.main-content-app {
  margin-left: 250px;
  padding: 20px;
}

/* Estilos para vista móvil */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    box-shadow: none;
  }

  .toggle-nav-btn {
    display: block;
    /* Mostrar botón en pantallas pequeñas */
  }

  nav {
    display: none;
    /* Ocultar navegación por defecto en pantallas pequeñas */
  }

  nav.nav-visible {
    display: flex;
    /* Mostrar navegación cuando isNavVisible es true */
    flex-direction: column;
    width: 100%;
  }

  nav a {
    margin: 5px;
    padding: 10px;
    font-size: 14px;
  }

  .main-content-app {
    margin-left: 0;
    padding: 10px;
  }
}
</style>
