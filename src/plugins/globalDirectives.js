import clickOutside from "../directives/click-ouside.js";

/**
 * Puedes registrar directivas globales y usarlas como plugin en tu instancia principal de Vue 3.
 */
const GlobalDirectives = {
  install(app) {
    app.directive("click-outside", clickOutside);
  },
};

export default GlobalDirectives;
