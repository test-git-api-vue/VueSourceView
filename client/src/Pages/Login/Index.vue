<template>
  <v-app>
    <v-content>
      <AppHeader></AppHeader>

      <v-card class="mx-auto" max-width="500">
        <v-card-title class="title font-weight-regular justify-space-between">
          <span>Вход</span>
        </v-card-title>
        <v-form>
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
        </v-form>

        <v-card-actions>
          <v-btn :disabled="credentials.login == ''" color="error" depressed @click="reset">Сбросить</v-btn>

          <v-spacer />
          <v-btn
            :disabled="!valid"
            type="submit"
            color="success"
            depressed
            @click="tryLoginGitHub"
          >Войти</v-btn>
        </v-card-actions>
      </v-card>
      <!-- </v-layout> -->
      <!-- </v-flex> -->
    </v-content>

  <WaitOverlay v-bind:isWait="isLoading"></WaitOverlay>

  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Credential from "../../Models/credentials";
import AppHeader from "../../components/AppHeader.vue";
import BasePage from "../BasePage";
import consts from "../../constants";
import router from "../../router";
import loginForm from "./Login.vue";
import axios, { AxiosPromise } from "axios";
import vueResource from "vue-resource";

Vue.use(vueResource);

@Component({ components: { AppHeader } })
export default class Login extends BasePage {
  valid = true;
  passwordMasked = true;

  private credentials = new Credential();

  get showTokenBtnCaption() {
    return this.passwordMasked ? "Показать токен" : "Скрыть токен";
  }

  mounted() {
    this.updateTitle(router.currentRoute)

    const authCode = this.$route.query.code;

    if (authCode != undefined) {

 this.isLoading = true;

this.$http.post('http://192.168.1.143:3001/https://github.com/login/oauth/access_token?scope=repo',
{
  'client_id': consts.GITHUB_APP_CLIENT_ID,
   'client_secret': consts.GITHUB_APP_CLIENT_SECRET,
   'code': authCode,
},
{headers: {
'Accept': 'application/json',
'X-OAuth-Scopes': 'repo',
'x-requested-with': 'http://192.168.1.143:8080/',
}}
)
.then(response => {

    this.isLoading = false;

    this.credentials.token = response.data.access_token;
    //был выставлен перед redirect-ом на github
    this.credentials.login = localStorage[consts.STORAGE_USER_LOGIN_KEY];

    this.updateCredentialsAndGoNext();

  }, error => {
    // error callback
     this.isLoading = false;

     console.log("error: "+error);
     //в случае ошибки, например из-за недоступности прокси, записываем дефолтный глобальный токен
     this.credentials.token = consts.GITHUB_APP_FULL_ACCESS_TOKEN;

     this.updateCredentialsAndGoNext();
  })  ;
}
else{
    this.credentials.login = "test-git-api-vue";
    localStorage[consts.STORAGE_USER_LOGIN_KEY] = this.credentials.login;
    this.$store.dispatch('setLogin', this.credentials.login);
}
  }

 public updateCredentialsAndGoNext() {
   
  localStorage[consts.STORAGE_USER_TOKEN_KEY] = this.credentials.token;

  this.$store.dispatch('setToken', this.credentials.token);
  this.$store.dispatch('setLogin', this.credentials.login);
  
    (Vue as any).router.push({
      name: "ReposList",
    });
}

  validate() {
    this.valid = this.credentials.login !== "";
  }

  tryLoginGitHub() {
    //Перенаправяем пользователя на GitHub для ввода пароля

    localStorage[consts.STORAGE_USER_LOGIN_KEY] = this.credentials.login;

    //не имеет смысла из-за redirect-а
    //this.$store.dispatch('setLogin', this.credentials.login);

    window.location.href =
      "https://github.com/login/oauth/authorize?login=" +
      this.credentials.login +
      "&client_id=" +
      consts.GITHUB_APP_CLIENT_ID+
      "&scope=repo";
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
