<!-- Template -->
<template>
  <div>
    <p class="flash" v-if="flashMessage">{{ flashMessage }}</p>
    <h1>USER MANAGEMENT</h1>
    <button @click="logout">Logout</button>
    <form @submit.prevent="updateCredentials">
      <h1>Credentials</h1>
      <div>
        <label for="current_username">Current Username</label>
        <input v-model="credentials.current_username" name="current_username" type="text" required>
      </div>
      <div>
        <label for="current_password">Current Password</label>
        <input v-model="credentials.current_password" name="current_password" type="text" required>
      </div>
      <div>
        <label for="new_username">New Username</label>
        <input v-model="credentials.new_username" name="new_username" type="text">
      </div>
      <div>
        <label for="new_password">New Password</label>
        <input v-model="credentials.new_password" name="new_password" type="text">
      </div>
      <button type="submit">Update</button>
    </form>
    <router-link to="/">Home</router-link>
  </div>
</template>

<!-- Script -->

<script>
import axios from "axios";
import { store } from "../store";

export default {
  name: "Admin",
  store,
  computed: {
    flashMessage() {
      if (["admin", "*"].includes(this.$store.state.flash.page)) {
        return this.$store.state.flash.message;
      }

      return "";
    }
  },
  data() {
    return {
      credentials: {
        current_username: "",
        current_password: "",
        new_username: "",
        new_password: ""
      }
    };
  },
  methods: {
    logout: function() {
      this.$store.dispatch("logout");
    },
    updateCredentials: function() {
      if (
        !this.credentials.current_username ||
        !this.credentials.current_password
      ) {
        return;
      }

      if (!this.credentials.new_username && !this.credentials.new_password) {
        return;
      }

      this.$store.dispatch("updateCredentials", this.credentials);
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

div > form {
  display: block;
  margin: 10px auto;
}

input {
  width: 200px;
  margin-left: 10px;
}
</style>
