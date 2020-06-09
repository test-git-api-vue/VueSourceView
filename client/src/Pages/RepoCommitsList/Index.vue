<template>
  <v-app>
    <v-container fluid pl-3 pr-1>
      <v-row wrap>
        <AppHeader></AppHeader>
      </v-row>

      <v-row align="center" justify="center" wrap class="no-left-right-margins">
        <v-col cols="10" class="no-top-bottom-paddings">
          <v-label>Список коммитов репозитория '{{repoInfo.name}}'</v-label>
        </v-col>

        <v-col cols="2" class="no-paddings">
          <v-select
            outlined
            dense
            hide-details="true"
            class="no-top-bottom-paddings"
            :items="branchNames"
            :value="selectedBranchName"
            v-model="selectedBranchName"
            @change="selectedBranchChanged"
          ></v-select>
        </v-col>
      </v-row>

      <v-row class="no-left-right-margins">
        <v-col cols="12">
          <v-data-table
            dense
            sortBy="commit.author.date"
            :headers="headers"
            :items="commits"
            :items-per-page="10"
            class="elevation-1"
          >
            <template
              v-slot:item.commit.author.date="{ item }"
            >{{ getConvertedTime(item.commit.author.date) }}</template>
          </v-data-table>
        </v-col>
      </v-row>

      <v-row class="no-left-right-margins">
        <v-btn color="#7092be" depressed width="250px" @click="backToReposList">
          <v-icon left>mdi-arrow-left-bold-outline</v-icon>
          <span class="mr-2">К списку репозиториев</span>
        </v-btn>
      </v-row>
    </v-container>

    <WaitOverlay v-bind:isWait="isLoading"></WaitOverlay>
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
import router from "../../router";
import BasePage from "../BasePage";

@Component({ components: { AppHeader, WaitOverlay } })
export default class RepoCommitsList extends BasePage {
  @Prop() credentials: Credentials|undefined;
  @Prop() repository: RepositoryInfo|undefined;

  private userInfo: Credentials|undefined;
  private repoInfo: RepositoryInfo|undefined;

  branches = [];
  commits = [];
  selectedBranchName = "";

  public get branchNames(): string[] {
    return (this.branches as any[]).map(x => x.name);
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

  mounted() {
     if (this.credentials == undefined || (this.credentials.token == "" && this.credentials.token == ""))
    {
      (Vue as any).router.push({ name: "Login" });
      return;
    }

    if (this.repository == undefined || (this.repository.name == ""))
    {
      (Vue as any).router.push({ name: "Login" });
      return;
    }

    this.userInfo = this.credentials as Credentials;
    this.repoInfo = this.repository as RepositoryInfo;
    
    this.isLoading = true;
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
          .then(response => {
            this.isLoading = false;
            this.commits = response.data;
          })
          .catch(error => {
            this.isLoading = false;
            console.error(error);
          });
      })
      .catch(error => {
        this.isLoading = false;
        console.error(error);
      });
  }

  getConvertedTime(time: any) {
    console.log("getConvertedTime invoked with time=" + time);

    const convertedTime = time.toLocaleString("ru", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    });

    console.log("getConvertedTime result=" + convertedTime);

    return convertedTime;
  }

  showRepoDetails() {
    console.log("item clicked");
  }

  selectedBranchChanged() {
    this.isLoading = true;

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
      .then(response => {
        this.isLoading = false;
        this.commits = response.data;
      })
      .catch(error => {
        this.isLoading = false;
        console.error(error);
      });
  }

  backToReposList() {
    (Vue as any).router.push({
      name: "ReposList",
      params: { credentials: this.credentials }
    });
  }
}
</script>
