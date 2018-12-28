<template>
  <div>
    <div class="grid">
      <div
        class="preview main-project"
        v-if="data.length"
        v-bind:style="{ background: 'url(' + data[0].images[0] + ')', backgroundSize: 'cover', backgroundPosition: 'center'}"
        v-on:click="setActiveProject(0)"
      ></div>
      <div
        class="preview minor-project-1"
        v-if="data.length"
        v-bind:style="{ background: 'url(' + data[1].images[0] + ')', backgroundSize: 'cover', backgroundPosition: 'center'}"
        v-on:click="setActiveProject(1)"
      ></div>
      <div
        class="preview minor-project-2"
        v-if="data.length"
        v-bind:style="{ background: 'url(' + data[2].images[0] + ')', backgroundSize: 'cover', backgroundPosition: 'center'}"
        v-on:click="setActiveProject(2)"
      ></div>
    </div>
  </div>
</template>

<script>
import { store } from "../../store";

export default {
  name: "ProjectPanels",
  store,
  methods: {
    setActiveProject(index) {
      this.$store.dispatch("setActiveProject", index);
    }
  },
  computed: {
    data() {
      return this.$store.state.projects;
    }
  }
};
</script>
