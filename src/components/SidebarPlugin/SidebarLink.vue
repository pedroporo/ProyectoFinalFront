<template>
  <li class="nav-item">
    <component :is="tag" class="nav-link" v-bind="$attrs" @click="hideSidebar">
      <slot>
        <i v-if="icon" :class="icon"></i>
        <p>{{ name }}</p>
      </slot>
    </component>
  </li>
</template>

<script>
import { markRaw } from 'vue';
export default {
  name: "sidebar-link",
  inheritAttrs: false,
  inject: {
    autoClose: {
      default: true,
    },
    addLink: {
      default: () => {},
    },
    removeLink: {
      default: () => {},
    },
  },
  props: {
    name: String,
    icon: String,
    tag: {
      type: String,
      default: "router-link",
    },
    active: { type: Boolean, default: false },
    rname: {
      type: String,
      default: "dashboard",
    },
  },
  methods: {
    hideSidebar() {
      if (this.autoClose) {
        this.$sidebar.displaySidebar(false);
      }
    },
    isActive() {
      return this.$el.firstChild.classList.contains("active");
    },
  },
  mounted() {
    if (this.addLink) {
      this.addLink(this);
    }
  },
  beforeDestroy() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    if (this.removeLink) {
      this.removeLink(this);
    }
  },
};
</script>
<style></style>
