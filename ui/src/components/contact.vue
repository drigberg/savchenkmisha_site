<template>
  <div id="contact">
    <p class="flash" v-if="$store.state.loggedIn && flashMessage">{{ flashMessage }}</p>
    <div>
      <p>
        <strong>email:</strong>
        {{ contact.email }}
      </p>
    </div>

    <p>
      <strong>github:</strong>
      {{ contact.github }}
    </p>
    <p>
      <strong>linkedin:</strong>
      {{ contact.linkedin }}
    </p>

    <form @submit.prevent="update" v-if="$store.state.loggedIn">
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

<script>
import { store } from "../store";

export default {
  name: "Contact",
  store,
  computed: {
    contactFromStore() {
      return JSON.stringify(this.$store.state.contact);
    },
    flashMessage() {
      if (["contact", "*"].includes(this.$store.state.flash.page)) {
        return this.$store.state.flash.message;
      }

      return "";
    }
  },
  data() {
    return {
      contact: {
        email: this.$store.state.contact.email,
        github: this.$store.state.contact.github,
        linkedin: this.$store.state.contact.linkedin
      }
    };
  },
  methods: {
    update: function() {
      this.$store.dispatch("updateContact", this.contact);
    }
  },
  watch: {
    contactFromStore: function(data) {
      this.contact = JSON.parse(data);
    }
  }
};
</script>

<style>
#contact {
  margin: 20px auto;
}
</style>
