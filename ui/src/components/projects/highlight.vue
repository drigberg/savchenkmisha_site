<template>
  <div>
    <div>
      <h2>{{ data.project.title }}</h2>
      <img :src="data.project.images[data.activeImage]">
      <p>{{ data.project.description }}</p>
    </div>
  </div>
</template>

<script>
import { store } from "../../store";

export default {
  name: "ProjectHighlight",
  store,
  computed: {
    data() {
      const index = this.$store.state.activeProject;
      const project = this.$store.state.projects[index] || {
        title: "Error: unable to load project"
      };

      return {
        project,
        activeImage: 0
      };
    }
  }
};
</script>
