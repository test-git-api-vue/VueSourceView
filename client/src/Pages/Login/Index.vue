<template>
  <v-app>
    <v-content>
      <AppHeader></AppHeader>

      <v-card class="mx-auto" max-width="500">
        <v-card-title class="title font-weight-regular justify-space-between">
          <span>Вход</span>
        </v-card-title>
      <v-window>
        <v-window-item :value="1">
          <v-card-text>
            <v-text-field
              label="Имя пользователя GitHub"
              type="text"
              @keyup="validate"
              value=""
              v-model="credentials.login"
              requred
            ></v-text-field>
          </v-card-text>
        </v-window-item>


          <v-window-item :value="1">
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
          </v-window-item>
        </v-window>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            :disabled="credentials.login == '' && credentials.password == ''"
            color="error"
            depressed
            @click="reset"
          >Сбросить</v-btn>

          <v-btn
            id="showTokenBtn"
            :disabled="credentials.password == ''"
            color="warning"
            depressed
            @click="showPassword"
          >{{showTokenBtnCaption}}</v-btn>
          <v-spacer />
          <v-btn :disabled="!valid" color="success" depressed @click="tryLogin">Войти</v-btn>
        </v-card-actions>
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

  private credentials = new Credential();

  get showTokenBtnCaption() {
    return this.passwordMasked ? "Показать токен" : "Скрыть токен";
  }

  validate() {
    this.valid = this.credentials.login !== "" && this.credentials.token !== "";
  }

  tryLogin() {
    this.validate();

    if (this.valid) {
      (Vue as any).router.push({
        name: "ReposList",
        params: { credentials: this.credentials }
      });
    }
  }

  reset() {
    this.credentials.login = "";
    this.credentials.token = "";
    this.valid = true;
  }

  showPassword() {
    this.passwordMasked = !this.passwordMasked;
  }
}
</script>
