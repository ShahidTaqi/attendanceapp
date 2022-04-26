<template>
  <v-container>
    <v-row>
      <v-col cols="8" offset="2">
        <v-card>
          <v-toolbar dark color="blue-grey darken-3">
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>

          <div class="ma-auto mt-3 mx-3">
            <v-alert color="error" dismissible v-if="emailError" dark>{{
              emailError
            }}</v-alert>
            <v-alert color="error" dismissible v-if="passwordError" dark>{{
              passwordError
            }}</v-alert>
          </div>

          <v-container class="pa-5">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-alert v-if="error" color="error" dismissible>{{
                error
              }}</v-alert>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="E-mail"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="password"
                    type="password"
                    :rules="passwordRules"
                    label="Password"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-btn color="success" @click="login" :disabled="!valid"
                    >Register</v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
            <v-overlay :value="overlay">
              <v-progress-circular
                indeterminate
                size="64"
              ></v-progress-circular>
            </v-overlay>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      password: "",
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 6) || "Password must be 6 characters long!",
      ],
      valid: true,
      overlay: false,
      error: null,
    };
  },
  computed: {
    emailError() {
      return this.$store.state.error.email;
    },
    passwordError() {
      return this.$store.state.error.password;
    },
    user(){
      return this.$store.state.user;
    }
  },
  methods: {
    async login() {
      this.overlay = true;
      this.error = null;

      this.$store
        .dispatch("loginUser", { email: this.email, password: this.password })
        .then(
          (result) => {
            if (this.emailError || this.passwordError) {
              alert(this.emailError);
              this.overlay = false;
            } else {
              console.log(" in Login "+result);
              this.$cookies.set("user", this.user);
              this.overlay = false;
              this.$router.push("/");
            }
          },
          (err) => {
            alert(err.message);
            this.overlay = false;
          }
        );
    },
  },
};
</script>

<style></style>
