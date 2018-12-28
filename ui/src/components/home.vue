<!-- Template -->
<template>
  <div>
    <router-link v-if="$store.state.loggedIn" to="/admin">Admin</router-link>
    <banner></banner>
    <div class="container">
      <projects></projects>
      <contact></contact>
    </div>
  </div>
</template>

<!-- Script -->

<script>
import { store } from "../store";
import projects from "./projects/index";
import contact from "./contact";
import banner from "./banner";

export default {
  name: "Home",
  store,
  components: {
    banner,
    contact,
    projects
  },
  computed: {
    flashMessage() {
      if (["home", "*"].includes(this.$store.state.flash.page)) {
        return this.$store.state.flash.message;
      }

      return "";
    }
  },
  created() {
    if (!this.$store.state.loaded) {
      this.$store.dispatch("loadData");
    }
  }
};
</script>

<!-- Style -->
<style>
.flash {
  background-color: #137aee;
  color: white;
  border-radius: 5px;
  width: 40%;
  margin: 0px auto;
}

.grid {
  height: 500px;
  grid-template-columns: 7fr 3fr;
  grid-template-rows: 6fr 4fr;
  display: grid;
  justify-items: stretch;
  align-items: stretch;
}

.main-project {
  grid-column-start: 1;
  grid-column-end: 1;
  grid-row-start: 1;
  grid-row-end: last-line;
}

.minor-project-1 {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  grid-column-start: 2;
  grid-column-end: last-line;
  grid-row-start: 1;
  grid-row-end: 2;
}

.minor-project-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  grid-column-start: 2;
  grid-column-end: last-line;
  grid-row-start: 2;
  grid-row-end: last-line;
}

img {
  flex-shrink: 0;
  min-width: 100%;
  max-height: 100%;
  object-fit: fill;
}

.container {
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0px auto;
}

i h2 {
  top: 60px;
  left: 0;
  position: absolute;
  text-align: center;
  width: 100%;
  color: white;
}

.circle:hover {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
