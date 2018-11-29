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
import Vue from "vue";

Vue.component("asset", {
  props: ["source"],
  template: '<img class="small" :src="source">'
});

Vue.component("project", {
  props: ["title", "description", "images"],
  data: function() {
    return {
      index: 0
    };
  },
  methods: {
    incrementProjectIndex: function() {
      const vm = this;
      vm.index += 1;

      if (vm.index >= vm.images.length) {
        vm.index = 0;
      }
    },
    decrementProjectIndex: function() {
      const vm = this;
      vm.index -= 1;

      if (vm.index < 0) {
        vm.index = vm.images.length - 1;
      }
    }
  },
  template: `
    <div>
      <h3>{{ title }} - {{ description }}</h3>
      <div class="flex">
        <div class="circle" v-on:click="decrementProjectIndex"></div>
        <asset v-bind:source="images[index]"></asset>
        <div class="circle" v-on:click="incrementProjectIndex"></div>
      </div>
    </div>`
});

export default {
  name: "Projects",
  data() {
    return {
      data: []
    };
  },
  created() {
    const vm = this;

    fetch("/api/projects")
      .then(response => response.json())
      .then(function(data) {
        vm.data = data;
        vm.projectIndex = 0;
      });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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

.flex {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}

.circle {
  background-color: #ababab;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  opacity: 0.5;
  margin-left: 18px;
  margin-right: 18px;
}

.circle:hover {
  opacity: 1;
}

.small {
  height: 100px;
  width: 100px;
}
</style>
