<template>
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
  </div>
</template>

<script>
import { store } from '../store'

export default {
  name: 'Contact',
  store,
  computed: {
    data () {
      return this.$store.state.contact
    }
  }
}
</script>
