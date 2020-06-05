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
          <v-list-item v-for="repo in reposList" :key="repo.name" @click="showRepoDetails">
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

@Component({ components: { AppHeader } })
export default class ReposList extends Vue {
  @Prop({ required: true, type: Credentials }) credentials!: Credentials;

  private readonly userInfo: Credentials;

  constructor() {
    super();
    this.userInfo = this.credentials;

    if (
      this.userInfo === undefined ||
      this.userInfo === null ||
      (this.userInfo.token == "" && this.userInfo.token == "")
    ) {
      (Vue as any).router.push({ name: "Login" });
    }
  }

  reposList: Array<RepositoryInfo> = [] as Array<RepositoryInfo>;

  mounted() {
    axios
      .get("https://api.github.com/users/" + this.userInfo.login + "/repos")
      .then(
        response =>
          (this.reposList = response.data.map(
            (x: any) => new RepositoryInfo(x)
          ))
      )
      .catch(error => console.error(error));
  }

  showRepoDetails() {
    console.log("item clicked");
    (Vue as any).router.push({
      name: "RepoCommitsList",
      params: { credentials: this.credentials, repository: this.reposList[1] }
    });
  }
}
</script>
