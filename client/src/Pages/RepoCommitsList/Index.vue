<style scoped src="../../styles/repoCommitsList.css"></style>
<style scoped src="../../styles/common.css"></style>

<template>
  <v-app>
    <v-container fluid pl-3 pr-1>
      <v-row wrap>
        <AppHeader></AppHeader>
      </v-row>

      <v-row align="center" justify="center" wrap class="no-left-right-margins">
        <v-col cols="10" class="no-top-bottom-paddings">
          <v-label>Список коммитов репозитория '{{this.repoInfo.name}}'</v-label>
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
            :headers="headers"
            :items="commits"
            :items-per-page="8"
            class="elevation-1"
            :sort-by="['commit.author.date']"
            :sort-desc="[true]"
            multi-sort
          >
            <template
              v-slot:item.commit.author.date="{ item }">{{ getConvertedTime(item.commit.author.date) }}
            </template>

             <template
              v-slot:item.commit.author.email="{ item }">
              <a class="v-label" v-bind:href="getMailToLink(item.commit.author.email)">{{ item.commit.author.email }}</a>
            </template>

            <template
              v-slot:item.="{ item }">
                <v-btn icon color="#7b9bc3" @click="showCommitDetails(item.sha)">
                  <v-icon>mdi-card-account-details-outline</v-icon>
                </v-btn>
            </template>

          </v-data-table>
        </v-col>
      </v-row>

      <v-row class="no-left-right-margins">
        <v-btn color="#7092be" depressed width="250px" @click="backToReposList">
          <v-icon left>mdi-arrow-left-bold-outline</v-icon>
          <span class="mr-2">К списку репозиториев</span>
        </v-btn>
        <v-spacer></v-spacer>
         <span class="last-loaded-time">Данные загружены: {{getConvertedTime(this.lastUpdated)}}</span>
      </v-row>
    </v-container>

    <CommitDetailPopup 
      :commitDetails="commitDetails" 
      :commitDetailsShown="commitDetailsShown"
      v-on:update:commitDetailsShown="commitDetailsShown = $event"
      />

    <WaitOverlay v-bind:isWait="isLoading"></WaitOverlay>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import RepositoryInfo from "..//..//Models/repositoryInfo";
import Credentials from "..//..//Models/credentials";
import axios, { AxiosResponse } from "axios";
import AppHeader from "../../components/AppHeader.vue";
import CommitDetailPopup from "../../components/CommitDetailPopup.vue";
import WaitOverlay from "../../components/WaitOverlay.vue";
import router from "../../router";
import BasePage from "../BasePage";
import moment from "moment";
import consts from "../../constants";


@Component({ components: { AppHeader, WaitOverlay, CommitDetailPopup } })
export default class RepoCommitsList extends BasePage {
  @Prop() repository: RepositoryInfo|undefined;

  private repoInfo = {} as RepositoryInfo;
  private commitDetails = {} as any;
  private commitDetailsShown = false;
  private lastUpdated = new Date()

    private readonly headers = [
    {
      text: "Время",
      align: "start",
      sortable: true,
      value: "commit.author.date",
      width: "165",
      divider:true
    },
    { text: "Описание", value: "commit.message",divider:true },
    { text: "Почта", value: "commit.author.email",divider:true },
    { text: "Автор", value: "commit.author.name", width:"140px", divider:true },
    { text: "", value: "", width:"20px", divider:true,  },
  ];

  branches = [];
  commits = [];
  selectedBranchName = "";

constructor()
{
  super()
     
    if (this.userToken === undefined || this.userToken === null || this.userToken == "") 
    {
      (Vue as any).router.push({ name: "Login" });
    }
}

  public get branchNames(): string[] {
    return (this.branches as any[]).map(x => x.name);
  }

  public get userLogin(){
    return localStorage[consts.STORAGE_USER_LOGIN_KEY];
  }

    public get userToken(){
    return localStorage[consts.STORAGE_USER_TOKEN_KEY];
  }

  getConvertedTime(time: any) {
    const convertedTime = moment(time).format(consts.DISPLAY_TIME_FORMAT)
    return convertedTime;
  }

  getMailToLink(email: string) {
    return "mailto:"+email;
  }

    beforeMount() {

     if (this.userLogin == undefined || (this.userLogin == "" && this.userToken == ""))
    {
      (Vue as any).router.push({ name: "Login" });
      return;
    }

    if (this.repository == undefined || (this.repository.name == ""))
    {
      (Vue as any).router.push({ name: "Login" });
      return;
    }

    this.repoInfo = this.repository as RepositoryInfo;
}

  mounted() {
  
  this.updateTitle(router.currentRoute)

  if (this.userLogin == undefined || this.repoInfo == null)
  {
    return;
  }
    
    this.isLoading = true;
    axios
      .get(
        "http://192.168.1.143:3001/https://api.github.com/repos/" +
          this.userLogin +
          "/" +
          this.repoInfo.name +
          "/branches"
      ,{headers:{
        'x-requested-with': 'http://192.168.1.143:8080/',
        'Authorization': 'token '+ this.userToken,
         'X-OAuth-Scopes': 'repo',
        }
      })
      .then(branchesResponse => {
        this.branches = branchesResponse.data;
        this.selectedBranchName = branchesResponse.data[0].name;

        axios
          .get(
            "http://192.168.1.143:3001/https://api.github.com/repos/" +
              this.userLogin +
              "/" +
              this.repoInfo.name +
              "/" +
              "commits?sha=" +
              this.selectedBranchName,
              {
                headers:{
                  'x-requested-with': 'http://192.168.1.143:8080/',
                  'Authorization': 'token '+ this.userToken,
                  'X-OAuth-Scopes': 'repo',
                }
              }
          )
          .then(response => {
            this.isLoading = false;
            this.commits = response.data;
            this.lastUpdated = new Date()
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

  showCommitDetails(sha: string) {
    this.isLoading = true;

   axios.get("http://192.168.1.143:3001/https://api.github.com/repos/" 
   + this.userLogin + "/" + this.repoInfo.name + "/" + "commits/" + sha,
   {
     headers:{
        'x-requested-with': 'http://192.168.1.143:8080/',
        'Authorization': 'token '+ this.userToken,
         'X-OAuth-Scopes': 'repo',
     }
   })
   .then(response => {
        this.isLoading = false;
        this.commitDetails = response.data;
        this.commitDetailsShown = true;

        
      })
      .catch(error => {
        this.isLoading = false;
        console.error(error);
      });
}

selectedBranchChanged() {
    this.isLoading = true;

    axios
      .get(
        "http://192.168.1.143:3001/https://api.github.com/repos/" +
          this.userLogin +
          "/" +
          this.repoInfo.name +
          "/" +
          "commits?sha=" +
          this.selectedBranchName,
          {
            headers:{
              'x-requested-with': 'http://192.168.1.143:8080/',
              'Authorization': 'token '+ this.userToken,
              'X-OAuth-Scopes': 'repo',
            }
          }
      )
      .then(response => {
        this.isLoading = false;
        this.commits = response.data;
        this.lastUpdated = new Date()
      })
      .catch(error => {
        this.isLoading = false;
        console.error(error);
      });
  }

  backToReposList() {
    (Vue as any).router.push({
      name: "ReposList",
    });
  }
}
</script>
