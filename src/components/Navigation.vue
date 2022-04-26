<template>
 <div>
    
      <v-app-bar
        color="blue-grey darken-3"
        dark
        fixed
        app
        style="z-index:100"
      >
        <v-app-bar-nav-icon @click="drawer = true" class="hidden-md-and-up ma-0 pa-0"></v-app-bar-nav-icon>
  
        <v-toolbar-title class="text-md-body-1 text-caption ma-0 pa-0">Attendance System Pro</v-toolbar-title>

        <v-spacer></v-spacer>

        <div class="hidden-md-and-up">
        <v-btn text to="/login" v-if="!user" x-small> Login </v-btn>
        <v-menu offset-y v-if="user" class="ma-0 pa-0">
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on"
            x-small
              >{{ user.name }}
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item style="cursor: pointer">
              <v-list-item-title>
                <v-btn text block @click="logout" x-small>
                  <v-icon left>mdi-logout</v-icon>
                  Logout
                </v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

         <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text to="/" > Home </v-btn>
        <v-btn text to="/attendance" > Attendance </v-btn>
        <v-btn text to="/users"  v-if="user && user.role.toLowerCase() === 'admin'"> Users </v-btn>
        <v-btn text to="/login" v-if="!user" >
          Login
        </v-btn>
        <v-menu offset-y v-if="user">
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on"
              >{{ user.name }}
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item style="cursor: pointer">
              <v-list-item-title>
                <v-btn text block @click="logout">
                  <v-icon left>mdi-logout</v-icon>
                  Logout
                </v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
      </v-app-bar>
  
      <v-navigation-drawer
        v-model="drawer"
        absolute
        temporary
        dark
        app
        color="blue-grey darken-3"
      >
     <v-list nav dense>
        <v-list-item-group v-model="group" active-class="activeClass">
          <v-list-item to="/">
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item to="/attendance">
            <v-list-item-title>Attendance</v-list-item-title>
          </v-list-item>

          <v-list-item to="/users" v-if="user && user.role.toLowerCase() === 'admin'">
            <v-list-item-title>Users</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      </v-navigation-drawer>
   </div>

</template>

<script>
export default {
    data(){
        return {
            drawer:false,
            group:null,
        }
    },
    computed:{
      user(){
        return this.$store.state.user;
      }
    },
    methods:{
      logout(){
        this.$emit("logout");
      }
    }

}
</script>

<style>

</style>