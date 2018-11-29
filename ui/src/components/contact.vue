<template>
  <div class="hello">
    <h1>{{ data.title }}</h1>
    <p>
      <strong>email:</strong>
      {{ data.email }}
    </p>
    <p>
      <strong>github:</strong>
      {{ data.github }}
    </p>
    <p>
      <strong>linkedin:</strong>
      {{ data.linkedin }}
    </p>

    <router-link to="/">Home</router-link>
  </div>
</template>

<script>
export default {
  name: "Contact",
  data() {
    return {
      data: {}
    };
  },
  created() {
    const vm = this;

    fetch("/api/contact")
      .then(response => response.json())
      .then(function(data) {
        vm.data = data;
      });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
