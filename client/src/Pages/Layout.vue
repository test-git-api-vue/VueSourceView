<template>
 <v-app id="inspire">
        <v-container fluid>
          <div class="mr-4 ml-4">
            <slot></slot>
          </div>
        </v-container>
    
    <v-footer app color="primary">
        <v-spacer></v-spacer>
        <v-card-text class="white--text text-center">
          {{ currentYear() }} &copy; VueSourceView

      <!--   <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
          <span class="mr-2 white--text">Latest Vuetify Release</span>
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn> -->

        </v-card-text>

        
      </v-footer>
  </v-app>


</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { RouteConfig } from 'vue-router'
import BasePage from './BasePage';
import moment from 'moment';

  export default class Layout extends BasePage {
      
      private currentYear()
      {
        return moment(new Date()).year();
      }
  }

</script>