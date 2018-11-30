<!-- Template -->
<template>
  <div class="hello">
    <form @submit.prevent="login">
      <h1>Login</h1>
      <p v-if="error">{{ error }}</p>
      <input required v-model="username" name="username" type="text">
      <label for="username">Username</label>
      <input required v-model="password" name="password" type="text">
      <label for="password">Password</label>
      <button type="submit">Login</button>
    </form>
    <br>
    <router-link to="/">Home</router-link>
  </div>
</template>

<!-- Script -->

<script>
import axios from "axios";
import Vue from "vue";

export default {
  name: "Login",
  data() {
    return {
      error: null,
      password: "",
      username: "",
      message: ""
    };
  },
  methods: {
    login: function() {
      const vm = this;

      axios
        .post("/api/login", {
          username: vm.username,
          password: vm.password
        })
        .then(response => {
          const token = response.data.token;
          if (!token) {
            vm.error = response.message || "Login failed";
            return;
          }

          localStorage.setItem("mishasite-user-token", token);
          axios.defaults.headers.common["Authorization"] = token;
          this.$router.push("/");
        })
        .catch(err => {
          localStorage.removeItem("mishasite-user-token");
          vm.error = "Login failed, sry bro";
        });
    }
  }
};
</script>

<!-- Style -->
<style>
</style>
