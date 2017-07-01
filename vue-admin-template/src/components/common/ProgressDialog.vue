<template>
<v-layout row justify-center>
  <v-dialog v-model="dialog" width="420">
    <v-card class="white">
      <v-card-text>
        <v-container fluid>
          <v-layout row>
            <v-flex xs3>
              <v-progress-circular indeterminate v-bind:size="50" class="primary--text"></v-progress-circular>
            </v-flex>
            <v-flex xs9 class="center-vertical">
              <h5 class="black--text">{{message}}</h5>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</v-layout>
</template>

<script>
export default {
  props: [
    'message',
  ],
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    show() {
      this.dialog = true;
    },
    hide() {
      this.dialog = false;
    },
  },
};
</script>

<style lang="css" scoped>
h5 {
  margin-bottom: 0;
}
</style>
