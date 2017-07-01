<template>
<v-app>
  <v-navigation-drawer persistent v-model="drawer" light enable-resize-watcher>
    <v-list dense>
      <v-list-item v-for="item in menu">
        <v-list-tile @click.native.stop="navigate(item.name)">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{item.name}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list-item>

      <v-list-item>
        <v-list-tile @click.native.stop="logout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-toolbar primary light>
    <v-toolbar-side-icon light @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
    <v-toolbar-title>Toolbar</v-toolbar-title>
  </v-toolbar>
  <main>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </main>
</v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      menu: [],
    };
  },
  created() {
    this.menu = this.$router.options.routes[1].children;
  },
  methods: {
    navigate(name) {
      this.$router.push({
        name,
      });
    },
    logout() {
      this.$auth.logout();
    },
  },
};
</script>

<style lang="css">
</style>
