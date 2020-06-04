<template>
  <v-card
    max-width="600"
    class="mx-auto"
  >
    <v-toolbar
      color="light-blue"
      dark
    >
      <v-toolbar-title>Список репозиториев '{{userInfo.login}}'</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list two-line>
      <v-list-item
        v-for="repo in reposList"
        :key="repo.title"
        @click="showRepoDetails"
      >
        <v-list-item-avatar>
          <v-icon>mdi-folder</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="repo.title"></v-list-item-title>

          <v-list-item-subtitle>Последнее изменение: {{repo.subtitle}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        v-for="repo in reposList"
        :key="repo.title"
        @click="showRepoDetails"
      >
      </v-list-item>
    </v-list>
  </v-card>
</template>

<style scoped>
.red-text{
  color: red;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import RepositoryInfo from '..//..//Models/repositoryInfo'
import Credentials from '..//..//Models/credentials'

@Component
export default class ReposList extends Vue {

@Prop({required:true, type: Credentials}) credentials!: Credentials;

private readonly userInfo: Credentials;

constructor(){
super()
this.userInfo = this.credentials;

 if (this.userInfo === undefined || this.userInfo === null
  || (this.userInfo.token == '' && this.userInfo.token == ''))
  {
    (Vue as any).router.push({ name: 'Login'})
  }
}

//TODO убрать
private d = new Date();
private yesterday = this.d.setDate(this.d.getDate() - 1);

reposList: Array<RepositoryInfo> = [
 {
        icon: 'folder',
        iconClass: 'grey lighten-1 white--text',
        title: 'Репозиторий 1',
        subtitle: new Date(this.yesterday).toDateString()
      }, {
        icon: 'folder',
        iconClass: 'grey lighten-1 white--text',
        title: 'Репозиторий 2',
        subtitle: 'Jan 17, 2014'
      }
];

showRepoDetails () {
        console.log('item clicked')
      }
}
</script>
