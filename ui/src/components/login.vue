<!-- Template -->
<template>
  <div>
    <p class="flash" v-if="flashMessage">{{ flashMessage }}</p>
    <form @submit.prevent="login">
      <h1>Login</h1>
      <input required v-model="username" name="username" type="text">
      <label for="username">Username</label>
      <input required v-model="password" name="password" type="text">
      <label for="password">Password</label>
      <button type="submit">Login</button>
    </form>
    <br>
    <form @submit.prevent="resetPassword">
      <h1>Forgot password?</h1>
      <input required v-model="username" name="username" type="text">
      <label for="username">Username</label>
      <button type="submit">Reset</button>
    </form>
    <router-link to="/">Home</router-link>
  </div>
</template>

<!-- Script -->

<script>
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
    },
    resetPassword: function() {
      const vm = this;

      this.$store.dispatch("resetPassword", {
        username: vm.username
      });
    }
  },
  computed: {
    loginStatus() {
      return this.$store.state.loggedIn;
    },
    flashMessage() {
      if (["login", "*"].includes(this.$store.state.flash.page)) {
        return this.$store.state.flash.message;
      }

      return "";
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
.flash {
  background-color: #137aee;
  color: white;
  border-radius: 5px;
  width: 40%;
  margin: 0px auto;
}
</style>
