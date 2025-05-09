<script>
import { BaseTable } from "@/components";
const tableColumns = ["Id", "Name", "Descripcion"];
import { useAgentsStore } from "@/stores/agentsStore";
import { mapState, mapActions } from "pinia";
export default {
  components: {
    BaseTable,
  },
  async mounted() {
    //await this.populateAgents();
  },
  computed: {
    ...mapState(useAgentsStore, {
      agentes: "agentes",
    }),
  },
  data() {
    return {
      table: {
        title: "Agentes",
        columns: [...tableColumns],
        //data: [...agents],
      },
    };
  },

  methods: {
    ...mapActions(useAgentsStore, ["populateAgents"]),
    handleClick(evt) {

      this.$router.push({ path: "/agents/"+this.agentes[evt].id });
      
      //this.$emit("click", evt);
    },
    createAgent() {

      this.$router.push({ path: "/agents/" });
      
      //this.$emit("click", evt);
    },
  },
};
</script>
<template>
  <div class="row">
    <div class="col-12">
      <card :title="table.title">
        <div class="table-responsive">
          <base-table
            :data="agentes"
            :columns="table.columns"
            thead-classes="text-primary"
            @clicked="handleClick"
          >
          </base-table>
        </div>
        <base-button slot="footer" type="primary" nativeType="link" @click="createAgent" fill
          >Iniciar sesion</base-button>
      </card>
    </div>
  </div>
</template>
<style></style>
