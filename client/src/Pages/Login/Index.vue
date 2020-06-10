<template>
  <v-app>
    <v-content>
      <AppHeader></AppHeader>

      <v-card class="mx-auto" max-width="500">
        <v-card-title class="title font-weight-regular justify-space-between">
          <span>Вход</span>
        </v-card-title>

        <v-form @submit.prevent="submit">
          <v-card-text>
            <v-text-field
              label="Имя пользователя GitHub"
              type="text"
              @keyup="validate"
              value=""
              v-model="credentials.username"
              requred
            ></v-text-field>
          </v-card-text>

            <v-card-text>
              <v-text-field
                id="passField"
                label="Персональный токен"
                :type="this.passwordMasked ? 'password' : 'text'"
                @keyup="validate"
                v-model="credentials.token"
                requred
              ></v-text-field>
              <!-- <v-spacer/> -->
            </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            :disabled="credentials.username == '' && credentials.token == ''"
            color="error"
            depressed
            @click="reset"
          >Сбросить</v-btn>

          <v-btn
            id="showTokenBtn"
            :disabled="credentials.token == ''"
            color="warning"
            depressed
            @click="showPassword"
          >{{showTokenBtnCaption}}</v-btn>
          <v-spacer />

          <v-btn :disabled="!valid" type="submit" color="success" depressed @click="submit">Войти</v-btn>
        </v-card-actions>
        </v-form>
      </v-card>
      <!-- </v-layout> -->
      <!-- </v-flex> -->
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Credential from "../../Models/credentials";
import AppHeader from "../../components/AppHeader.vue";
import BasePage from '../BasePage';

@Component({ components: { AppHeader } })
export default class Login extends BasePage {
  valid = true;
  passwordMasked = true;

   private credentials = {} as Credential;

   public mounted() {
      if (this.$auth.check()) {
        this.$router.push({ name: 'ReposList' });
      }
    }

get showTokenBtnCaption() {
    return this.passwordMasked ? "Показать токен" : "Скрыть токен";
  }

  validate() {
    this.valid = this.credentials.username !== "" && this.credentials.token !== "";
  }

  submit() {
    this.validate();

     localStorage["tp_auth_token"] = this.credentials.token;
     localStorage["tp_auth_user"] = this.credentials.username;

     this.$auth.login(this.credentials);

/*
    if (this.valid) {
      (Vue as any).router.push({
        name: "ReposList",
        params: { credentials: this.credentials }
      });
    }
    */
  }

  reset() {
    this.credentials.username = "";
    this.credentials.token = "";
    this.valid = true;
  }

  showPassword() {
    this.passwordMasked = !this.passwordMasked;
  }
}
</script>
