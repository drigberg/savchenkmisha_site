<template>
  <div class="hello">
    <h1>{{ data.title }}</h1>
    <p>{{ data.text }}</p>
    <img v-for="image in data.images" v-bind:key="image" :src="image">
    <router-link to="/">Home</router-link>
  </div>
</template>

<script>
export default {
  name: "About",
  data() {
    return {
      data: {}
    };
  },
  created() {
    const vm = this;

    fetch("/api/about")
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

img {
  display: block;
  margin: 10px auto;
}
</style>
