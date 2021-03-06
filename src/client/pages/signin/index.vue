<template>

  <v-container
    fluid
    fill-height
    class="signin-bg"
  >
    <v-layout
      align-center
      justify-center
    >
      <v-flex
        xs12
        sm8
        md4
      >
        <v-card class="elevation-10">
          <v-toolbar
            dark
            class="blue-gradient "
          >
            <v-spacer />
            <v-toolbar-title class="headline font-enforce font-weight-thin">
              Login to your account
            </v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-form @submit.prevent="login">
            <v-card-text>
              <v-text-field
                v-model.trim="email"
                :error-messages="$helpers.checkError('email', validationProps, $v)"
                prepend-icon="person"
                name="email"
                label="Email"
                type="text"
                @input="$v.email.$touch()"
              />
              <v-text-field
                v-model="password"
                :error-messages="$helpers.checkError('password', validationProps, $v)"
                :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                :type="showPassword ? 'text' : 'password'"
                prepend-icon="lock"
                name="password"
                label="Password"
                counter
                @input="$v.password.$touch()"
                @click:append="showPassword = !showPassword"
              />
              <v-flex
                xs12
                sm4
                text-xs-center
              >
                <v-btn
                  :to="{name:`forgot-password___${$i18n.locale}`}"
                  class="primary--text"
                  flat
                  exact
                >Forgot password ?</v-btn>
              </v-flex>
              <v-flex
                xs12
                sm4
                text-xs-center
              >
                <v-btn
                  :to="{name:`resend-verification-email___${$i18n.locale}`}"
                  class="primary--text"
                  flat
                  exact
                >Resend Verification Email</v-btn>
              </v-flex>
            </v-card-text>
            <v-card-actions>
              <v-btn
                :to="{name:`signup___${$i18n.locale}`}"
                class="primary--text"
                flat
                exact
              >Create account</v-btn>
              <v-spacer />
              <v-btn
                :loading="submitted"
                class="light-blue accent-3 white--text"
                type="submit"
                @click.prevent="login"
              >SIGN IN</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {
  required,
  email
} from "vuelidate/lib/validators"
import { validationMixin } from "vuelidate"
import { mapState } from "vuex"

export default {
  auth: false,
  head () {
    return this.$helpers.setMetaSEOHead("Sign In", null, "Sign In", "Sign In", this.baseUrl)
  },
  layout: "noFooterTransparentNav",
  middleware: ["guest-only"],
  mixins: [ validationMixin ],
  data () {
    return {
      showPassword: false,
      password: null,
      email: null,
      submitted: false,
      isErr: false,
      message: "",
      validationProps: {
        email: {
          required,
          email
        },
        password: {
          required
        }
      }
    }
  },
  computed: {
    ...mapState({
      baseUrl: state => state.baseUrl
    })
  },
  mounted () {
    if (this.inactive) {
      this.isErr = true
      this.message = "You have been logged out due to inactivity."
    }
  },
  methods: {
    login () {
      this.isErr = false
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.submitted = true

        this.$auth.loginWith("local", {
          data: {
            email: this.email,
            password: this.password
          }
        })
          .then(() => {
            this.submitted = false
            this.$nuxt.$router.push("/")
            this.$store.dispatch("setupSnackbar", {
              show: true,
              text: "Welcome Back !",
              type: "success"
            })
          })
          .catch((err) => {
            this.submitted = false
            let text = "Invalid email or password."
            if (err.response.status === 403) {
              text = "Account is not verified. Please check your email for verification."
            }
            this.$store.dispatch("setupSnackbar", {
              show: true,
              text,
              type: "error"
            })
          })
      }
    }
  },
  validations () {
    return this.validationProps
  }
}
</script>

<style >
</style>
