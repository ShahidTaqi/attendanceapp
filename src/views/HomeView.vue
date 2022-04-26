<template>
  <div>
    <div style="position:relative;" class="d-flex justify-center">
      <div style="position:absolute;top:30%;z-index:10;color:white;background-color:black;opacity:0.9;padding:20px">
    <h1 style="font-weight:bold;padding:5px;" class="text-body-2 text-sm-body-1 text-md-h6 text-xl-h4">
      Attendance Management System</h1>
      <h3 style="margin:5px" class="text-caption text-sm-caption">You want to expolore! Let's get started.</h3>
      <v-btn color="success" class="ma-5" v-if="!user" to="/login">Login</v-btn>
      <v-btn color="success" class="ma-5" v-if="user" to="/attendance">Attandance Page</v-btn>
      </div>
    <v-img src="@/assets/bg.jpg" max-height="100vh" height="100vh"></v-img>
    </div>
  </div>
</template>

<script>
 

  export default {
    name: 'Home',

    components: {
     
    },
    computed:{
      user:function(){
        return this.$store.state.user;
      }
    }
  }
</script>
