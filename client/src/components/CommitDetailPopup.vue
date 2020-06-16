<template>
  <v-row justify="center">
    <v-dialog v-model="commitDetailsShown" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Детали коммита от {{formattedCommitTime}}</span>
        </v-card-title>
        <v-card-subtitle style="padding-bottom: 0px; padding-top: 0px;">
          <span class="headline">
            <v-label>Автор: </v-label>
          <a class="v-label" v-bind:href="authorEmailLink">{{commitDetailsShown ? commitDts.commit.author.name : ''}} &lt;{{ authorEmail }}&gt;</a>
          </span>
        </v-card-subtitle>
        <v-card-text>
          <v-container>
            <v-row>
              <span>Описание:</span>
              <span>{{commitDetailsShown ? commitDts.commit.message : ''}}</span>
            </v-row>
            <v-row style="padding-top:5px">
              <!-- Таблица с изменениями файлов -->
              <v-data-table
                dense
                sortBy="commit.author.date"
                :headers="headers"
                :items="commitDts.files"
                :items-per-page="10"
                class="elevation-1"
              >
                <template v-slot:item.status="{ item }">{{ getRusStatus(item.status) }}</template>
              </v-data-table>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="$emit('update:commitDetailsShown', false)"
          >Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
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
import RepositoryInfo from "..//Models/repositoryInfo";
import Credentials from "..//Models/credentials";
import axios from "axios";
import WaitOverlay from "./WaitOverlay.vue";
import router from "../router";
import moment from "moment";
import consts from "../constants"

@Component({ components: { WaitOverlay } })
export default class CommitDetailPopup extends Vue {
  @Prop() commitDetails: any|undefined;
  @Prop() commitDetailsShown: boolean|undefined;

  public get commitDts(){
    return this.commitDetailsShown ? this.commitDetails : {} as any;
  }

  private readonly headers = [
    { text: "Файл", value: "filename", divider: true, sortable: true,align: 'start'  },
    { text: "Статус", value: "status", divider: true,sortable: true,align: 'center' },
    { text: "Изм.", value: "changes", divider: true,align: 'center' },
    { text: "+", value: "additions", divider: true,align: 'center' },
    { text: "- ", value: "deletions", divider: true,align: 'center' }
  ];

  public get authorEmail(){
    return this.commitDetailsShown ? this.commitDts.commit.author.email : '';
  }
  
     public get authorEmailLink(){
      return "mailto:"+this.authorEmail;
    }

  public get formattedCommitTime() {
    if (this.commitDts === undefined || this.commitDts.commit === undefined)
    {
      return "-"
    }
    
    return moment(this.commitDetails.commit.author.date).format(
      consts.DISPLAY_TIME_FORMAT
    );
  }

  getRusStatus(engStatus: string) {
    let ruStatus = "";

    if (engStatus == undefined) {
      return ruStatus;
    }

    switch (engStatus) {
      case "modified": {
        ruStatus = "Изменен";
        break;
      }
      case "added": {
        ruStatus = "Добавлен";
        break;
      }
      case "removed": {
        ruStatus = "Удален";
        break;
      }
    }

    return ruStatus;
  }
}
</script>