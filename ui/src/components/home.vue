<!-- Template -->
<template>
  <div>
    <p class="flash" v-if="$store.state.loggedIn && flashMessage">{{ flashMessage }}</p>
    <h1>{{ banner.title }}</h1>
    <h3>{{ banner.subtitle }}</h3>
    <p>{{ banner.bio }}</p>
    <form @submit.prevent="update" v-if="$store.state.loggedIn">
      <div>
        <label for="title">Title</label>
        <input v-model="banner.title" name="title" type="text">
      </div>
      <div>
        <label for="subtitle">Subtitle</label>
        <input v-model="banner.subtitle" name="subtitle" type="text">
      </div>
      <div>
        <label for="bio">Bio</label>
        <input v-model="banner.bio" name="bio" type="text">
      </div>
      <button type="submit">Update</button>
    </form>
    <div class="container">
      <projects></projects>
      <contact></contact>
    </div>
  </div>
</template>

<!-- Script -->

<script>
import { store } from "../store";
import projects from "./projects";
import contact from "./contact";

export default {
  name: "Home",
  store,
  components: {
    contact,
    projects
  },
  computed: {
    bannerFromStore() {
      return JSON.stringify(this.$store.state.banner);
    },
    flashMessage() {
      if (["home", "*"].includes(this.$store.state.flash.page)) {
        return this.$store.state.flash.message;
      }

      return "";
    }
  },
  created() {
    if (!this.$store.state.loaded) {
      this.$store.dispatch("loadData");
    }
  },
  data() {
    return {
      banner: {
        bio: this.$store.state.banner.bio,
        subtitle: this.$store.state.banner.subtitle,
        title: this.$store.state.banner.title
      }
    };
  },
  methods: {
    update: function() {
      this.$store.dispatch("updateBanner", this.banner);
    }
  },
  watch: {
    bannerFromStore: function(data) {
      this.banner = JSON.parse(data);
    }
  }
};
</script>

<!-- Style -->
<style>
.flash {
  background-color: #137aee;
  color: white;
  border-radius: 5px;
}

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
