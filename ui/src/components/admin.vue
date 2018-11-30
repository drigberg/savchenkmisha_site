<!-- Template -->
<template>
  <div class="hello">
    <h1>ADMIN</h1>
    <button @click="logout">Logout</button>
    <form @submit.prevent="updateContact">
      <h1>Contact info</h1>
      <div>
        <label for="email">Email</label>
        <input v-model="contact.email" name="email" type="text">
      </div>
      <div>
        <label for="github">Github</label>
        <input v-model="contact.github" name="github" type="text">
      </div>
      <div>
        <label for="linkedin">LinkedIn</label>
        <input v-model="contact.linkedin" name="linkedin" type="text">
      </div>
      <button type="submit">Update</button>
    </form>
  </div>
</template>

<!-- Script -->

<script>
import axios from "axios";
import Vue from "vue";
import { store } from "../store";

Vue.directive("placeholder", {
  bind: function(el, binding, vnode) {
    console.log(el, binding, vnode);
    el.placeholder = binding.value;
    el.value = binding.value;
  }
});
export default {
  name: "Admin",
  store,
  data() {
    return {
      contact: {
        email: this.$store.state.contact.email,
        github: this.$store.state.contact.github,
        linkedin: this.$store.state.contact.linkedin
      }
    };
  },
  created() {
    if (!this.$store.state.loaded) {
      this.$store.dispatch("loadData");
    }
  },
  computed: {
    projectsFromStore() {
      return JSON.stringify(this.$store.state.projects);
    },
    contactFromStore() {
      return JSON.stringify(this.$store.state.contact);
    }
  },
  methods: {
    logout: function() {
      const vm = this;
      localStorage.removeItem("mishasite-user-token");

      axios.get("/api/logout").then(response => {
        vm.$router.go("/");
      });
    },
    updateContact: function() {
      const vm = this;
      this.$store.dispatch("updateContact", vm.contact);
    }
  },
  watch: {
    contactFromStore: function(data) {
      this.contact = JSON.parse(data);
    }
  }
};
</script>

<!-- Style -->
<style>
div > form {
  display: block;
  margin: 10px auto;
}

input {
  width: 200px;
  margin-left: 10px;
}
</style>
