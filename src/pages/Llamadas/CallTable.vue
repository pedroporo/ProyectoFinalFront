<script>
import { BaseTable } from "@/components";
import CallItem from "./CallItem.vue";
import { useLlamadasStore } from "@/stores/llamadaStore";
const tableColumns = ["id", "contact_name", "phone_number","call_date", "status"];

import { mapState, mapActions } from "pinia";
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
  name: "call-table",
  props: ["agentId"],
  components: {
    BaseTable,
    Form,
    Field,
    ErrorMessage,
    CallItem,
  },
  async mounted() {
    await this.populateCalls(this.agentId);
  },
  computed: {
    ...mapState(useLlamadasStore, {
      llamadas: "llamadas",
    }),
  },
  data() {
    return {
      table: {
        title: "Llamadas",
        columns: [...tableColumns],
        //data: [...agents],
      },
      dataCSV: {},
      loadTable: true,
      create: false,
      loadCall: undefined,
    };
  },

  methods: {
    ...mapActions(useLlamadasStore, ["populateCalls", "uploadCsv"]),
    handleClick(evt) {
      //console.log(this.llamadas[evt]);

      this.loadCall = this.llamadas[evt];
      //console.log(this.loadCall);

      this.loadTable = !this.loadCall ? true : false;
      //this.$emit("click", evt);
    },
    createCall(mod) {
      if (!mod) {
        this.$router.push({ path: "/call/" + this.agentId + "/" });
      }else{
        this.$router.push({ path: "/call/" + this.loadCall.id + "/mod" });
      }
      //this.$router.push({ path: "/" + agentId + "/" });
      //this.$emit("click", evt);
    },
    handleUnmount() {
      //console.log("Unmounted");
      //this.loadCall=undefined;
      //this.loadTable = !this.loadCall ? true : false;
    },
    async subirCSV() {
      await this.uploadCsv(this.dataCSV.file, this.agentId);
    },
  },
};
</script>
<template>
  <div class="row">
    <div class="col-12">
      <card :title="table.title">
        <div v-if="loadTable" class="table-responsive">
          <base-table
            :data="llamadas"
            :columns="table.columns"
            thead-classes="text-primary"
            @clicked="handleClick"
            seccion="calls"
            :useSeccion="true"
          >
          </base-table>
        </div>
        <div v-if="!loadTable && loadCall">
          <call-item @unmounted="handleUnmount" :item="loadCall"> </call-item>
        </div>
        <base-button
          v-if="loadTable"
          slot="footer"
          type="primary"
          nativeType="link"
          @click="createCall(false)"
          fill
          >Crear Llamada</base-button
        >
        <base-button
          v-else
          slot="footer"
          type="primary"
          nativeType="link"
          @click="createCall(true)"
          fill
          >Modificar Llamada</base-button
        >
        <Form
          class="form login-form"
          ref="callFileForm"
          :v-model="dataCSV"
          style="width: 15%"
        >
          <div class="">
            <base-input-file fileText="Haz click aqui para subir el archivo">
              <label class="control-label control-file-label" for="file"
                >Haz click aqui para subir el archivo csv</label
              >
              <Field
                name="callcsv"
                ref="callcsv"
                placeholder="Introduce tu email o nombre de usuario"
                type="file"
                :class="[
                  'form-control',
                  {
                    'is-valid':
                      $refs.callcsv?.meta.valid && $refs.callcsv?.meta.touched,
                    'is-invalid':
                      $refs.callcsv?.meta.valid === false &&
                      $refs.callcsv?.meta.touched,
                  },
                ]"
                accept=".csv"
                v-model="dataCSV.file"
                @change="subirCSV"
              >
              </Field>
              <ErrorMessage class="invalid-feedback" name="callcsv" />
            </base-input-file>
          </div>
        </Form>
      </card>
    </div>
  </div>
</template>
<style></style>
