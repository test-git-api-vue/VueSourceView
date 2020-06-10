<template>
<div>
    <v-app-bar app color="primary" dark>
        <div class="d-flex align-center">
          <!-- https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png -->
          <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            src="../assets/logo2.png"
            transition="scale-transition"
            width="40"
          />

          <h3>Vue Source View</h3>
        </div>

        <v-spacer></v-spacer>

        <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
          <span class="mr-2">Latest Vuetify Release</span>
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
      </v-app-bar>

</div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
import BasePage from '../Pages/BasePage';

@Component
  export default class AppHeader extends Vue { 
      
      
        
          
      
      }

</script>