<!-- Template -->
<template>
  <div class="hello">
    <h1>ADMIN</h1>
    <button @click="logout">Logout</button>
  </div>
</template>

<!-- Script -->

<script>
import axios from "axios";
import Vue from "vue";

export default {
  name: "Admin",
  data() {
    return {};
  },
  methods: {
    logout: function() {
      const vm = this;
      localStorage.removeItem("mishasite-user-token");

      axios.get("/api/logout").then(response => {
        vm.$router.go("/");
      });
    }
  }
};
</script>

<!-- Style -->
<style>
</style>
