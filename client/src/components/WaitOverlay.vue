<template>
  <v-overlay :value="isWait">
    <v-progress-circular :size="40" :width="20" indeterminate color="#811993"></v-progress-circular>
  </v-overlay>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class WaitOverlay extends Vue {
  @Prop({ required: true, type: Boolean }) isWait = false;
  //private isLoading = false;

  //constructor() {
  //    super();
  //this.isLoading = this.isWait;
  //}
}
</script>
