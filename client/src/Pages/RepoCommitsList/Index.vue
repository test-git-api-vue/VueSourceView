<template>
  <v-app>
    <v-toolbar color="#e8f4f8" light flat max-height="60px">
      <v-toolbar-title>Список коммитов репозитория '{{repoInfo.name}}'</v-toolbar-title>

        <v-spacer></v-spacer>

        
        <v-select
          :items="branchNames"
          :value="selectedBranchName"
          v-model="selectedBranchName"
          @change="selectedBranchChanged"
        ></v-select>
      

    </v-toolbar>
    <AppHeader></AppHeader>
    <v-data-table
      sortBy="commit.author.date"
      :headers="headers"
      :items="commits"
      :items-per-page="10"
      class="elevation-1"
    ></v-data-table>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import RepositoryInfo from "..//..//Models/repositoryInfo";
import Credentials from "..//..//Models/credentials";
import axios from "axios";
import AppHeader from "../../components/AppHeader.vue";

@Component({ components: { AppHeader } })
export default class RepoCommitsList extends Vue {
  @Prop({ required: true, type: Credentials }) credentials?: Credentials;
  @Prop({ required: true, type: RepositoryInfo }) repository?: RepositoryInfo;

  private readonly userInfo: Credentials;
  private readonly repoInfo: RepositoryInfo;

  branches = [];
  commits = [];
  selectedBranchName = "";


public get branchNames(): string[] {
  return (this.branches as any[]).map(x => x.name)
}


  private readonly headers = [
    {
      text: "Время",
      align: "start",
      sortable: false,
      value: "commit.author.date"
    },
    { text: "Описание", value: "commit.message" },
    { text: "Почта", value: "commit.author.email" },
    { text: "Автор", value: "commit.author.name" },
    { text: " sha", value: "sha" }
  ];

  constructor() {
    super();
    this.userInfo = this.credentials as Credentials;
    this.repoInfo = this.repository as RepositoryInfo;

    if (
      this.userInfo === undefined ||
      this.userInfo === null ||
      (this.userInfo.token == "" && this.userInfo.token == "")
    ) {
      (Vue as any).router.push({ name: "Login" });
    }
  }

  mounted() {
    axios
      .get(
        "https://api.github.com/repos/" +
          this.userInfo.login +
          "/" +
          this.repoInfo.name +
          "/branches"
      )
      .then(branchesResponse => {
        this.branches = branchesResponse.data;
        this.selectedBranchName = branchesResponse.data[0].name;

        axios
          .get(
            "https://api.github.com/repos/" +
              this.userInfo.login +
              "/" +
              this.repoInfo.name +
              "/" +
              "commits?sha=" +
              this.selectedBranchName
          )
          .then(response => (this.commits = response.data))
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  }

  showRepoDetails() {
    console.log("item clicked");
  }

  selectedBranchChanged(){
     axios
          .get(
            "https://api.github.com/repos/" +
              this.userInfo.login +
              "/" +
              this.repoInfo.name +
              "/" +
              "commits?sha=" +
              this.selectedBranchName
          )
          .then(response => (this.commits = response.data))
          .catch(error => console.error(error));
  }
}
</script>
