<template>
  <div class="hello">
    <div>
      <p>
        <strong>email:</strong>
        {{ contact.email }}
      </p>
      <input v-if="$store.getters.isLoggedIn" v-model="contact.email" name="email" type="text">
    </div>

    <p>
      <strong>github:</strong>
      {{ contact.github }}
    </p>
    <p>
      <strong>linkedin:</strong>
      {{ contact.linkedin }}
    </p>
  </div>
</template>

<script>
import { store } from "../store";

export default {
  name: "Contact",
  store,
  computed: {
    contact() {
      return this.$store.state.contact;
    }
  }
};
</script>
