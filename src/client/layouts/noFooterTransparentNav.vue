<template>
  <v-app>
    <top-nav :nav-color="'transparent'" />
    <v-content
      class="pa-0"
      app
    >
      <snackbar />
      <nuxt/>
    </v-content>
  </v-app>
</template>

<script>
import Snackbar from "~/components/Snackbar.vue"
import TopNav from "~/components/TopNav.vue"

export default {
  components: {
    Snackbar,
    TopNav
  },
  methods: {
    contentClass () {
      let contentClass = ""
      if (this.checkPathForContentClass()) {
        contentClass = "pa-0"
      }
      return contentClass
    },
    checkPathForContentClass () {
      return (
        this.$route.path === "/" ||
        this.$route.path === "/signin" ||
        this.$route.path === "/signup" ||
        this.$route.path === "/forgot-password" ||
        this.$route.path === "/resend-verification" ||
        this.$route.path.indexOf("reset-password") !== -1
      )
    }
  }
}
</script>

<style>
.signin-bg{
    min-height: 30em;
    background-image: url("~assets/img/signin-bg.jpg") !important;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
}
</style>
