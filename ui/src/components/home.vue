<!-- Template -->
<template>
  <div class="hello">
    <h1>{{ title }}</h1>
    <h3>{{ subtitle }}</h3>
    <div class="container">
      <projects></projects>
      <contact></contact>
    </div>
  </div>
</template>

<!-- Script -->

<script>
import Vue from "vue";
import { store } from "../store";

Vue.component("projects", {
  name: "Projects",
  store,
  computed: {
    data() {
      return this.$store.state.projects;
    }
  },
  created() {
    fetch("/api/projects")
      .then(response => response.json())
      .then(function(data) {
        store.commit("updateProjects", data);
      });
  },
  template: `
    <div>
      <div class="grid">
        <div
          class="preview main-project"
          v-if=data.length
          v-bind:style="{ background: 'url(' + data[0].images[0] + ')', backgroundSize: 'cover', backgroundPosition: 'center'}"></div>
        <div
          class="preview minor-project-1"
          v-if=data.length
          v-bind:style="{ background: 'url(' + data[1].images[0] + ')', backgroundSize: 'cover', backgroundPosition: 'center'}"></div>
        <div
          class="preview minor-project-2"
          v-if=data.length
          v-bind:style="{ background: 'url(' + data[2].images[0] + ')', backgroundSize: 'cover', backgroundPosition: 'center'}"></div>
      </div>
    </div>`
});

Vue.component("contact", {
  name: "Contact",
  store,
  created() {
    fetch("/api/contact")
      .then(response => response.json())
      .then(function(data) {
        store.commit("updateContact", data);
      });
  },
  computed: {
    data() {
      return this.$store.state.contact;
    }
  },
  template: `
    <div class="hello">
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

    </div>`
});

export default {
  name: "Home",
  data() {
    return {
      title: "MISHA SAVCHENKO",
      subtitle: "Engineer, Grizzly Bear, Proud Father"
    };
  }
};
</script>

<!-- Style -->
<style>
.grid {
  height: 500px;
  grid-template-columns: 7fr 3fr;
  grid-template-rows: 6fr 4fr;
  display: grid;
  justify-items: stretch;
  align-items: stretch;
}

.main-project {
  grid-column-start: 1;
  grid-column-end: 1;
  grid-row-start: 1;
  grid-row-end: last-line;
}

.minor-project-1 {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  grid-column-start: 2;
  grid-column-end: last-line;
  grid-row-start: 1;
  grid-row-end: 2;
}

.minor-project-2 {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  grid-column-start: 2;
  grid-column-end: last-line;
  grid-row-start: 2;
  grid-row-end: last-line;
}

img {
  flex-shrink: 0;
  min-width: 100%;
  max-height: 100%;
  object-fit: fill;
}

.container {
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0px auto;
}
i h2 {
  top: 60px;
  left: 0;
  position: absolute;
  text-align: center;
  width: 100%;
  color: white;
}

.circle:hover {
  opacity: 1;
}
</style>
