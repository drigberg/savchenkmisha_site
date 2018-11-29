<!-- Template -->

<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div class="container">
      <router-link to="/about">
        <div class="image">
          <div class="overlay"></div>
          <img src="../assets/about.jpg" />
          <h2>About</h2>
        </div>
      </router-link>
      <router-link to="/projects">
        <div class="image">
          <div class="overlay"></div>
          <img src="../assets/projects.jpg" />
          <h2>Projects</h2>
        </div>
      </router-link>
      <router-link to="/contact">
        <div class="image">
          <div class="overlay"></div>
          <img src="../assets/contact.jpg" />
          <h2>Contact</h2>
        </div>
      </router-link>
    </div>
  </div>
</template>

<!-- Script -->

<script>
export default {
  name: 'Home',
  data () {
    return {
      msg: 'Misha Savchenko'
    }
  }
}
</script>

<!-- Style -->
<style scoped>
.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.image {
  margin: 10px;
  position: relative;
  width: 200px;
}

img {
  border: 5px solid #cdcdcd;
}

h2 {
  top: 60px;
  left: 0;
  position:absolute;
  text-align:center;
  width: 100%;
  color: white;
}

.image:hover > .overlay {
  width: 210px;
  height: 210px;
  position: absolute;
  background-color: #000;
  opacity: 0.5;
}
</style>
