<template>
  <v-row justify="center" v-if="user">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-toolbar>
            <v-toolbar-title>Edit User</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" xl="6" md="6">
                  <v-text-field
                    label="Full Name*"
                    required
                    :value="name ? name:user.name"
                    @input="inputName"
                    :rules="nameRules"
                    hint="Enter your full name!"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" xl="6" md="6">
                  <v-text-field
                    label="Email Address*"
                    hint="Enter Your email address!"
                    :value="email ? email:user.email"
                    @input="inputEmail"
                    :rules="emailRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" xl="6" md="6">
                  <v-text-field
                    label="Phone*"
                    required
                    :value="phone ? phone:user.phone"
                    @input="inputPhone"
                    :rules="phoneRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" xl="6" md="6">
                  <v-select
                    :items="['Admin', 'End User']"
                    label="User Type*"
                    required
                    :value="role ? role:user.role"
                    @input="inputRole"
                    :rules="roleRules"
                  ></v-select>
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
              @click="updateUser"
              :disabled="!valid"
            >
              Update
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: ["dialog","userId"],
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
    error: null,
  }),
  computed: {
    editUserError() {
      return this.$store.state.error.editUserError;
    },
    user(){
      return this.$store.getters.userById(this.userId);
    }
  },
  methods: {
     inputName(e){
      this.name=e;
    },
    inputEmail(e){
      this.email=e;
    },
    inputPhone(e){
      this.phone=e;
    },
    inputRole(e){
      this.role=e;
    },
    updateUser() {
      const isValid = this.$refs.form.validate();
      console.log(this.user);
        if (!isValid) {
          return;
        } else {
          var name=this.name ? this.name:this.user.name;
          var email=this.email ? this.email:this.user.email;
          var phone=this.phone ? this.phone:this.user.phone;
          var role=this.role ? this.role:this.user.role;
          const userData={id:this.user._id,user:{name,email,phone,role}};
          this.$store.dispatch("editUser", userData).then(
            () => {
              if (this.editUserError) {
                this.error = "There is an error editing user";
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
      
    },
    close() {
      this.$emit("close", false);
    },
  },
};
</script>