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
import Component from 'vue-class-component'

@Component
export default class App extends Vue {

}
</script>
