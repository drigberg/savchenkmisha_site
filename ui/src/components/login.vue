<!-- Template -->
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <router-link to="/">
      <div class="image">
        <div class="overlay"></div>
        <img src="../assets/about.jpg">
        <h2>Back to home</h2>
      </div>
    </router-link>
  </div>
</template>

<!-- Script -->

<script>
import Vue from "vue";

export default {
  name: "Login",
  data() {
    return {
      msg: "Login page goes here"
    };
  }
};
</script>

<!-- Style -->
<style>
</style>
