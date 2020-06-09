<template>
  <v-app>
    <AppHeader></AppHeader>
    
      <v-card min-width="100%" class="mx-auto">
        <v-toolbar color="#e8f4f8" light flat>
          <!-- <v-toolbar color="#d4ebf2" light flat> -->
          <v-toolbar-title>Список репозиториев '{{userInfo.login}}'</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-toolbar>

        <v-list two-line flat color="#f7fbfd">
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
    <v-row>
    <v-spacer/>
    <v-btn color="warning" depressed width="200px" @click="backToLoginPage">
      <v-icon left>mdi-arrow-up-bold-outline</v-icon>
      <span class="mr-2">Выйти</span>
    </v-btn>
</v-row>
    <WaitOverlay v-bind:isWait="isLoading"></WaitOverlay>
  </v-app>
</template>

<style scoped>
.red-text {
  color: red;
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
  @Prop({ type: Credentials }) credentials: Credentials;

  private readonly userInfo: Credentials;

  constructor() {
    super();
    if (
      this.credentials === undefined ||
      this.credentials === null ||
      (this.credentials.token == "" && this.credentials.token == "")
    ) {
      (Vue as any).router.push({ name: "Login" });
    }

     this.userInfo = this.credentials;
  }

  reposList: Array<RepositoryInfo> = [] as Array<RepositoryInfo>;

  mounted() {
    this.isLoading = true;
    
    axios
      .get("https://api.github.com/users/" + this.userInfo.login + "/repos")
      .then(
        response =>
          {
            this.isLoading = false;
            this.reposList = response.data.map((x: any) => new RepositoryInfo(x))
            }
      )
      .catch(error => {
        this.isLoading = false;
        console.error(error)});
  }

  showRepoDetails(repo: RepositoryInfo) {
    (Vue as any).router.push({
      name: "RepoCommitsList",
      params: { credentials: this.credentials, repository: repo }
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
