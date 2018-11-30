<!-- Template -->
<template>
  <div class="hello">
    <form @submit.prevent="login">
      <h1>Login</h1>
      <p v-if="loginMessage">{{ loginMessage }}</p>
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
import Vue from "vue";
import { store } from "../store";

export default {
  name: "Login",
  store,
  data() {
    return {
      password: "",
      username: ""
    };
  },
  methods: {
    login: function() {
      const vm = this;

      this.$store.dispatch("login", {
        username: vm.username,
        password: vm.password
      });
    }
  },
  computed: {
    loginStatus() {
      return this.$store.state.login.success;
    },
    loginMessage() {
      return this.$store.state.login.message;
    }
  },
  watch: {
    loginStatus: function(success) {
      if (success) {
        this.$router.go("./");
      }
    }
  }
};
</script>

<!-- Style -->
<style>
</style>
