import {
  BaseInput,
  Card,
  BaseDropdown,
  BaseButton,
  BaseCheckbox,
} from "../components/index";

/**
 * Puedes registrar componentes globales y usarlos como plugin en tu instancia principal de Vue 3.
 */
const GlobalComponents = {
  install(app) {
    app.component(BaseInput.name, BaseInput);
    app.component(Card.name, Card);
    app.component(BaseDropdown.name, BaseDropdown);
    app.component(BaseButton.name, BaseButton);
    app.component(BaseCheckbox.name, BaseCheckbox);
  },
};

export default GlobalComponents;
