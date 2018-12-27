<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import axios from "axios";
import { store } from "./store";

export default {
  name: "App",
  store,
  computed: {
    toLogout() {
      return this.$store.state.logout;
    }
  },
  watch: {
    toLogout: function(logout) {
      if (logout) {
        this.$store.dispatch("logout");
      }
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
