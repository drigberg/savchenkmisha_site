<template>
  <div class="hello">
    <h1>Projects</h1>
    <project
      v-for="project in data"
      v-bind:key="project.id"
      v-bind:title="project.title"
      v-bind:description="project.description"
      v-bind:images="project.images"
    ></project>
    <router-link to="/">Home</router-link>
  </div>
</template>

<script>

import Vue from 'vue'

Vue.component('asset', {
  props: ['source'],
  template: '<img class="small" :src="source">'
})

Vue.component('project', {
  props: ['title', 'description', 'images'],
  template: `
  <div>
    <h3>{{ title }} - {{ description }}</h3>
    <asset
      v-for="source in images"
      v-bind:source="source"
    ></asset>
  </div>`
})

export default {
  name: 'Projects',
  data () {
    return {
      data: []
    }
  },
  created () {
    const vm = this

    fetch('/api/projects')
      .then((response) => response.json())
      .then(function (data) {
        console.log(JSON.stringify(data))
        vm.data = data
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
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

.small {
  height: 100px;
  width: 100px;
}
</style>
