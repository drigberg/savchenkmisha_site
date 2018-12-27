<template>
  <div class="container">
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
  </div>
</template>


<script>
import { store } from "../store";

export default {
  name: "Banner",
  store,
  computed: {
    bannerFromStore() {
      return JSON.stringify(this.$store.state.banner);
    },
    flashMessage() {
      if (["banner", "*"].includes(this.$store.state.flash.page)) {
        return this.$store.state.flash.message;
      }

      return "";
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

<style>
.container {
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0px auto;
}

.flash {
  background-color: #137aee;
  color: white;
  border-radius: 5px;
  width: 40%;
  margin: 0px auto;
}
</style>
