<template>
  <v-app>
    

    <v-main>
      <navigation @logout="logout"></navigation>
      <div v-if="onLine">
        <span v-if="timeoutError">{{"Connection Timeout. Please Try again!"}}</span>
        <span v-else><router-view :timeoutError="timeoutError" style="min-height:100vh;" />
        </span>
      </div>
      <div v-else style="text-align: center" class="pt-12">
        <h1>Network Error:Please check your network.</h1>
      </div>

      <v-overlay :value="overlay" :absolute="absolute" :opacity="opacity" color="#ddd">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
     <Footer></Footer>
    </v-main>
  </v-app>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import Footer from "@/components/Footer1.vue";
export default {
  name: "App",
  components: {
    Navigation,
    Footer
  },
  data: () => ({
    onLine: navigator.onLine ? true : false,
    showBackOnline: false,
    timeoutError: null,
    overlay: false,
    absolute: true,
      opacity: 1,
  }),
  methods:{
    logout(){
      this.$cookies.remove("user");
      this.$store.dispatch("logout");
      this.$router.push("/login");
    }
  },
  watch: {
    onLine: function (val) {
      console.log(val);
      if (this.onLine === true) {

        this.showBackOnline = true;
        setTimeout(() => {
          this.showBackOnline = false;
        }, 1000);
      } else {
        this.overlay=false;
        this.onLine = false;
      }
    },

    
  },
  created: function () {
    if(this.onLine){
      this.overlay=true;
    }
    this.$store
      .dispatch("getUsers")
      .then(() => {
        this.overlay=false;
        console.log("Users Loaded" + this.$store.state.users);
      })
      .catch((err) => {
        this.timeoutError = err.message;
        this.overlay=false;
        console.log(err.message);
      });
    this.$store.dispatch("getAttendances");
    this.$store.dispatch("getHolidays");
  },
};
</script>
