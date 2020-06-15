<template>
  <v-app>
    <v-container fluid pl-3 pr-1>

    <v-row wrap>
        <AppHeader></AppHeader>
      </v-row>
    
<v-row align="center" justify="center" wrap class="no-padding-left">
        <v-col cols="11" class="no-top-bottom-paddings">
          <v-label>Список репозиториев '{{userLogin}}'</v-label>
        </v-col>
        <v-col>
          <v-spacer></v-spacer>
        </v-col>
         <v-col class="no-paddings">
           <v-spacer></v-spacer>
           <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
           </v-col>
        </v-row>

<v-row class="no-left-right-margins">
      <v-card min-width="100%" class="mx-auto">
        <v-list two-line flat class="no-left-right-margins">
          <v-list-item v-for="repo in reposList" :key="repo.name" @click="showRepoDetails(repo)">
            <v-list-item-avatar>
              <v-icon>mdi-folder</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="repo.name"></v-list-item-title>

              <v-list-item-subtitle>Последнее изменение:{{repo.pushedAt}}</v-list-item-subtitle>

              <v-divider></v-divider>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
</v-row>

    <v-row class="no-left-right-margins">
    <v-spacer/>
    <v-btn color="warning" width="200px" @click="backToLoginPage">
      <v-icon left>mdi-arrow-up-bold-outline</v-icon>
      <span class="mr-2">Выйти</span>
    </v-btn>
</v-row>

    <WaitOverlay v-bind:isWait="isLoading"></WaitOverlay>

</v-container>
  </v-app>

</template>

<style scoped>
.v-btn {
  color: white;
  margin-top: 5px;
}
.v-select {
  max-width: 200px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.no-paddings {
  padding: 0px;
}

.no-padding-left {
  padding-left: 0px;
}

.no-top-bottom-paddings {
  padding-bottom: 0px;
  padding-top: 0px;
}

.no-left-right-margins {
  margin-left: 0px;
  margin-right: 0px;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import RepositoryInfo from "..//..//Models/repositoryInfo";
import Credentials from "..//..//Models/credentials";
import axios from "axios";
import AppHeader from "../../components/AppHeader.vue";
import WaitOverlay from "../../components/WaitOverlay.vue";
import BasePage from '../BasePage';

@Component({ components: { AppHeader,WaitOverlay } })
export default class ReposList extends BasePage {

public get userLogin()
{
  return localStorage["vsv_login"];
}

public get userToken()
{
  return localStorage["vsv_token"];
}

  constructor() {
    super();
    
    if (
      this.userLogin === undefined ||
      this.userLogin === null ||
      (this.userToken == "" && this.userToken == "")
    ) {
      (Vue as any).router.push({ name: "Login" });
    }
  }

  reposList: Array<RepositoryInfo> = [] as Array<RepositoryInfo>;

  mounted() {
    this.isLoading = true;
    
    this.$http
      .get("http://192.168.1.143:3001/https://api.github.com/user/repos",
      {
        headers:{
          'Authorization': 'token '+ this.userToken,
          'X-OAuth-Scopes': 'repo',
          'Accept': 'application/json',
          'x-requested-with': 'http://192.168.1.143:8080/',
        }
      })
      .then(response => {
      {
            this.isLoading = false;
            this.reposList = response.data.map((x: any) => new RepositoryInfo(x))
      }
      }, error => {
        this.isLoading = false;
        console.error(error)});
  }

  showRepoDetails(repo: RepositoryInfo) {
    (Vue as any).router.push({
      name: "RepoCommitsList",
      params: {repository: repo}
    });
  }
  
  backToLoginPage()
  {
     (Vue as any).router.push({
      name: "Login",
    });
  }
}
</script>
