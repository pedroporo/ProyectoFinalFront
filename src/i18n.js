//import VueI18n from "vue-i18n";
//import * as VueI18n from 'vue-i18n';
import { createI18n } from 'vue-i18n'

function loadLocaleMessages() {
  const messages = {};
  const modules = import.meta.glob('./locales/*.json', { eager: true });
  for (const path in modules) {
    const matched = path.match(/([a-z0-9-_]+)\.json$/i);
    if (matched && matched[1]) {
      const locale = matched[1];
      messages[locale] = modules[path].default || modules[path];
    }
  }
  return messages;
}

//export default new VueI18n({
//  locale: import.meta.env.VUE_APP_I18N_LOCALE || "en",
//  fallbackLocale: import.meta.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
//  messages: loadLocaleMessages(),
//});

export default createI18n({
  legacy: false,
  locale: import.meta.env.VUE_APP_I18N_LOCALE || 'es',
  fallbackLocale: import.meta.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages(),
});