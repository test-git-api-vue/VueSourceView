<template>
  <v-app>
    <v-content>
      <router-view v-if="$route.meta.hideLayout" />
      <div v-if="!$route.meta.hideLayout">
        <router-view />
      </div>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'App',

  components: {},

  data: () => ({
    //
  })
})
</script>
