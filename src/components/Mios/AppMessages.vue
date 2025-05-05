<script>
import { store } from "@/stores/store";
import { mapState, mapActions } from "pinia";
import { useMessageStore } from "@/stores/messagesStore";
export default {
  name: "AppMessages",
  computed: {
    ...mapState(useMessageStore, {
      messages: "messages",
    }),
  },
  methods: {
    remMessage(index) {
      print(index);
      this.delMessage(index);
    },
    ...mapActions(useMessageStore, ["delMessage"]),
  },
};
</script>
<template>
  <div id="messages">
    <div
      v-for="(message, index) in messages"
      role="alert"
      :key="index"
      :class="['alert alert-dismissible alert-'+message.tipo]"
      :index="index"
      alert
      alert-danger
      alert-dismissible
    >
      {{ message.message }}
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        :key="index"
        :index="index"
        @click="remMessage"
      >
        
      </button>
    </div>
  </div>
</template>
<style scoped>
.alert {
  position: relative;
  padding: 0.9rem 1.25rem;
  margin-bottom: 1rem;
  border-radius: 0.2857rem;
}
.messages {
  position: fixed;
}
.errorM {
  color: red;
}
.success {
  background-color: lightgreen;
  color: black;
}
</style>
