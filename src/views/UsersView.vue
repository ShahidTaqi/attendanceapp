<template>
  <div id="app">
    <v-toolbar>
      <v-toolbar-title>Registered Users
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn dark color="green" class="pr-3 font-weight-bold" @click="addUser" text x-small>
        <v-icon class="pa-3">mdi-account-plus</v-icon>
        New User
      </v-btn>

      
    </v-toolbar>
    <div v-if="users.length < 1" class="d-flex justify-center my-6">{{"No Data to display"}}</div>
    <v-data-table
    v-else
      :headers="headers"
      :items="users"
      item-key="_id"
      class="elevation-2 pa-6"
      loading="$store.getters.isLoadedUsers"
      loading-text="Loading... Please wait.."
    >
      <template v-slot:top>
        <!-- v-container, v-col and v-row are just for decoration purposes. -->
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6">
              <v-row class="pa-6">
                <!-- Filter for dessert name-->
                <v-text-field
                  v-model="nameFilterValue"
                  type="text"
                  label="Name"
                ></v-text-field>
              </v-row>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6">
              <v-row class="pa-6">
                <!-- Filter for dessert name-->
                <v-text-field
                  v-model="emailFilterValue"
                  type="text"
                  label="Email"
                ></v-text-field>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </template>
       <template v-slot:item.srno="{ item }">

     {{(users.map(function(x) {return x._id; }).indexOf(item._id))+1}}.
     
    </template>
      <template v-slot:item.action="{ item }">

     <v-btn text color="green" x-small @click.stop="editUser(item)">
            <v-icon >
  mdi-pencil
</v-icon>
  </v-btn>
  <v-btn text color="pink" x-small  @click.stop="deleteUser(item)">
            <v-icon >
  mdi-delete
</v-icon>
  </v-btn>
     
    </template>
    </v-data-table>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
           <v-toolbar dark>
              <v-toolbar-title>Delete User</v-toolbar-title>
          </v-toolbar>
        

        <v-card-text class="pt-6">
         Do you want to delete this user record?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            No
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="deleteItemYes"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="text-center">
     <v-dialog
      v-model="dialogLoading"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="grey"
        dark
      >
        <v-card-text>
          Deleting. Please wait...
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
  {{attendanceByUser}}

  <add-user-dialog :dialog="addUserDialog" @close="closeDialog"></add-user-dialog>
  <update-user-dialog :dialog="updateUserDialog" :userId="userId" @close="closeEditUserDialog"></update-user-dialog>
  </div>

  
</template>

<script>
import AddUserDialog from "@/components/AddUserDialog.vue";
import UpdateUserDialog from "@/components/UpdateUserDialog.vue";
export default {
    components:{
        AddUserDialog,
        UpdateUserDialog
    },
    props:["timeoutError"],
  data() {
    return {
      updateUserDialog:false,
        userId:null,
        addUserDialog:false,
      dialog:false,
      dialogLoading:false,
      singleSelect: true,
      selected: [],
      menu: false,
      modal: false,
      emailFilterValue: null,

      // Filter models.
      nameFilterValue: null,
    };
  },
  computed: {

      deleteUserError(){
          return this.$store.state.error.userDeleteError;
      },
       fetchUsersError(){
          return this.$store.state.error.userError;
      },
      attendanceDeleteError(){
      return this.$store.state.error.attendanceDeleteError;
    },
    
    users() {
      return this.$store.state.users;
    },
    attendanceByUser(){
      console.log(this.userId);
      return this.$store.getters.attendanceByUser(this.userId);
    },
   attendances(){
      return this.$store.state.attendances;
    },
    headers() {
      return [
           {
          text: "Sr.No",
          align: "left",
          sortable: false,
          value: "srno",
        },
        {
          text: "Employee Name",
          align: "left",
          sortable: false,
          value: "name",
          filter: this.nameFilter,
        },
        {
          text: "Email",
          value: "email",
          align: "left",
          sortable: false,
          filter: this.emailFilter,
        },
        { text: "Phone", value: "phone",sortable:false },
        { text: "Role", value: "role",sortable:false },
        { text: "Actions", value:"action",align: "center",sortable:false },
      ];
    },
  },
  watch: {
      dialogLoading (val) {
        if (!val) return
        if(this.userDeleteError){
            this.dialogLoading = false
        }
      },
      timeoutError(){
        if(this.timeoutError){
          alert("Timeout Error");
        }
      }
    },
  methods: {
    closeEditUserDialog(){
      this.updateUserDialog=false;
    },
    editUser(user){
      this.updateUserDialog=true;
      this.userId=user._id;
      console.log(this.attendanceByUser);
    },
      closeDialog(status){
          this.addUserDialog=status;
      },
      addUser(){
       this.addUserDialog=true;
      },
      deleteUser(user){
          this.dialog=true;
          this.userId=user._id;
          console.log(user._id);
      },
      deleteItemYes(){
          this.dialog=false;
          this.$store.dispatch("deleteUser", this.userId).then(
              () => {
                if(this.deleteUserError){
                  console.log("Error Deleting User");
                }else {
                  this.attendanceByUser.forEach(att => {
                    this.$store.dispatch("deleteAttendance",att._id)
                    .then(()=> {
                      if(this.attendanceDeleteError){
                        console.log("Error deleting attendances associated to this user");
                      }else {
                        console.log("Attendances deleted successfully!");
                      }
                    })
                  });
                }
              },
              (error) => {
                console.log(error.message);
              }
            );
          
      },
   
    /**
     * Filter for dessert names column.
     * @param value Value to be tested.
     * @returns {boolean}
     */
    nameFilter(value) {
      // If this filter has no value we just skip the entire filter.
      if (!this.nameFilterValue) {
        return true;
      }

      // Check if the current loop value (The dessert name)
      // partially contains the searched word.
      return value.toLowerCase().includes(this.nameFilterValue.toLowerCase());
    },

    /**
     * Filter for calories column.
     * @param value Value to be tested.
     * @returns {boolean}
     */
    emailFilter(value) {
      // If this filter has no value we just skip the entire filter.
      if (!this.emailFilterValue) {
        return true;
      }

      // Check if the current loop value (The calories value)
      // equals to the selected value at the <v-select>.
      return value.toLowerCase().includes(this.emailFilterValue.toLowerCase());
    },
  },
};
</script>

<style>
</style>