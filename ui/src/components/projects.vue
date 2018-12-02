<template>
  <div>
    <div class="grid">
      <div
        class="preview main-project"
        v-if="data.length"
        v-bind:style="{ background: 'url(' + data[0].images[0] + ')', backgroundSize: 'cover', backgroundPosition: 'center'}"
      ></div>
      <div
        class="preview minor-project-1"
        v-if="data.length"
        v-bind:style="{ background: 'url(' + data[1].images[0] + ')', backgroundSize: 'cover', backgroundPosition: 'center'}"
      ></div>
      <div
        class="preview minor-project-2"
        v-if="data.length"
        v-bind:style="{ background: 'url(' + data[2].images[0] + ')', backgroundSize: 'cover', backgroundPosition: 'center'}"
      ></div>
    </div>
  </div>
</template>

<script>
import { store } from '../store'

export default {
  name: 'Projects',
  store,
  computed: {
    data () {
      return this.$store.state.projects
    }
  }
}
</script>
