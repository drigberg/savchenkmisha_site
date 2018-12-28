<template>
  <div>
    <panels v-if="this.$store.state.activeProject === false"></panels>
    <transition name="fade">
      <highlight v-if="this.$store.state.activeProject !== false"></highlight>
    </transition>
  </div>
</template>

<script>
import { store } from "../../store";
import highlight from "./highlight";
import panels from "./panels";

export default {
  name: "Projects",
  components: {
    highlight,
    panels
  },
  store
};
</script>
