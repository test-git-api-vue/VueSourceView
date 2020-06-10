<template>
  <v-app>
    <v-content>
        <router-view v-if="$route.meta.hideLayout" />
          <layout v-if="!$route.meta.hideLayout">
            <router-view/>
          </layout>
    </v-content>
   
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import Layout from "./Pages/Layout.vue"

@Component({
  components: {Layout}
})
export default class App extends Vue {

}
</script>
