<template>
  <table class="table tablesorter" :class="tableClass">
    <thead :class="theadClasses">
      <tr>
        <slot name="columns">
          <th v-for="column in columns" :key="column">
            {{ useSeccion ? $t(seccion + "." + column) : column }}
          </th>
        </slot>
      </tr>
    </thead>
    <tbody :class="tbodyClasses">
      <tr
        v-for="(item, index) in data"
        :key="index"
        :id="index"
        @click="handleClick(index)"
      >
        <slot :row="item">
          <template v-for="(column, index) in columns">
            <td :key="index" v-if="hasValue(item, column)">
              {{ itemValue(item, column) }}
            </td>
          </template>
        </slot>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  name: "base-table",
  props: {
    columns: {
      type: Array,
      default: () => [],
      description: "Table columns",
    },
    data: {
      type: Array,
      default: () => [],
      description: "Table data",
    },
    type: {
      type: String, // striped | hover
      default: "",
      description: "Whether table is striped or hover type",
    },
    seccion: {
      type: String, // striped | hover
      default: "",
      description: "La traduccion que se va a pillar",
    },
    useSeccion: {
      type: Boolean,
      default: false,
      description: "Indica si se debe pillar las traducciones",
    },
    eventClicked: {
      type: Boolean,
      default: false,
      description: "Indica si una fila debe emitir un evento al ser clickado",
    },
    theadClasses: {
      type: String,
      default: "",
      description: "<thead> css classes",
    },
    tbodyClasses: {
      type: String,
      default: "",
      description: "<tbody> css classes",
    },
  },
  computed: {
    tableClass() {
      return this.type && `table-${this.type}`;
    },
  },
  methods: {
    hasValue(item, column) {
      return item[column.toLowerCase()] !== "undefined";
    },
    itemValue(item, column) {
      return item[column.toLowerCase()];
    },
    handleClick(evt) {
      this.$emit("clicked", evt);
    },
  },
};
</script>
<style></style>
