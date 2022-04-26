<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-toolbar>
            <v-toolbar-title>User Registeration</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" xl="6" md="6">
                  <v-text-field
                    label="Full Name*"
                    required
                    v-model="name"
                    :rules="nameRules"
                    hint="Enter your full name!"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" xl="6" md="6">
                  <v-text-field
                    label="Email Address*"
                    hint="Enter Your email address!"
                    v-model="email"
                    :rules="emailRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" xl="6" md="6">
                  <v-text-field
                    label="Phone*"
                    required
                    v-model="phone"
                    :rules="phoneRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" xl="6" md="6">
                  <v-select
                    :items="['Admin', 'End User']"
                    label="User Type*"
                    required
                    v-model="role"
                    :rules="roleRules"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="12" xl="6" md="6">
                  <v-text-field
                    label="Password*"
                    type="password"
                    required
                    v-model="passOne"
                    :rules="passwordRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" xl="6" md="6">
                  <v-text-field
                    label="Repeat Password*"
                    type="password"
                    required
                    v-model="passTwo"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
            <v-alert v-if="error" type="error" color="red">{{ error }}</v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close"> Close </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="saveUser"
              :disabled="!valid"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: ["dialog"],
  data: () => ({
    valid: true,
    name: null,
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length >= 5) || "Name must be 5 characters long!",
    ],
    email: null,
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    phone: null,
    phoneRules: [
      (v) => !!v || "Cell Number is required",
      (v) => (v && v.length >= 5) || "Phone number must be 5 characters long!",
    ],
    role: null,
    roleRules: [(v) => !!v || "User Role is required"],
    passOne: null,
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) => (v && v.length >= 6) || "Password must be 6 characters long!",
    ],
    passTwo: null,
    error: null,
  }),
  computed: {
    addUserError() {
      return this.$store.state.error.addUserError;
    },
  },
  methods: {
    saveUser() {
      const userData = {
        name: this.name,
        email: this.email,
        phone: this.phone,
        password: this.passOne,
      };
      const isValid = this.$refs.form.validate();

      if (this.passOne !== this.passTwo) {
        console.log("Password does not match");
        this.error = "Password does not match";
        return;
      } else {
        if (!isValid) {
          return;
        } else {
          const registerData = {
            name: this.name,
            email: this.email,
            phone: this.phone,
            password: this.passOne,
            role: this.role,
          };

          this.$store.dispatch("addUser", registerData).then(
            () => {
              if (this.addUserError) {
                this.error = "There is an error adding user";
              } else {
                  this.$refs.form.reset();
                this.$emit("close", false);
              }
            },
            (err) => {
              console.log(err);
              this.error = err.message;
            }
          );
        }
      }
    },
    close() {
      this.$emit("close", false);
    },
  },
};
</script>