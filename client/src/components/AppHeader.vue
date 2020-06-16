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

      <v-btn href="" target="_blank" text>
          <span class="mr-2 white--text">{{getUserLogin()}}</span>
          <v-icon>mdi-account</v-icon>
        </v-btn>

        <v-btn @click="logOut" text>
           <span class="mr-2 white--text">Выйти</span>
            <v-icon>mdi-arrow-up-bold-outline</v-icon>
        </v-btn>

      </v-app-bar>

</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import BasePage from '../Pages/BasePage';
import consts from '../constants';
import router from '../router';

@Component
  export default class AppHeader extends Vue { 
      
    logOut()
    {
      localStorage.removeItem(consts.STORAGE_USER_LOGIN_KEY);
      localStorage.removeItem(consts.STORAGE_USER_TOKEN_KEY);

      (Vue as any).router.push({
          name: "Login",
        });
    }

      public getUserLogin()
      {
        const login = localStorage[consts.STORAGE_USER_LOGIN_KEY];

        if (login == undefined || login == null)
        {
          return '';
        }

        return login;
      }
      }

</script>