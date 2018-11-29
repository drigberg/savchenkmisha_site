<!-- Template -->
<template>
  <div class="hello">
    <h1>Login</h1>
    <form action="/api/login" method="post">
      <input name="username" type="text">
      <label for="username">Username</label>
      <input name="password" type="text">
      <label for="password">Password</label>
      <input type="submit" value="login">
    </form>
  </div>
</template>

<!-- Script -->

<script>
import Vue from "vue";

export default {
  name: "Login"
};
</script>

<!-- Style -->
<style>
</style>
