<template>
  <v-app>

    <v-main>
      <AppHome/>
    </v-main>
  </v-app>
</template>

<script>
import AppHome from './AppHome';

export default {
  name: 'App',

  components: {
    AppHome,
  },

  data: () => ({
    //
  }),
};
</script>
