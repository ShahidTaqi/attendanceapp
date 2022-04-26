<template>
  <v-row justify="center">
      
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
          <v-card>
    <v-toolbar
      color="primary"
      dark
    >
      <v-toolbar-title>Holidays List</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="red" @click="close">X</v-btn>
    </v-toolbar>
    <v-tabs fixed-tabs v-model="tab">
      <v-tab>
        
        Holidays
      </v-tab>
      <v-tab>
        
        Add Holiday
      </v-tab>
      

      <v-tab-item>
        <v-card flat >
          <v-card-text >
          
    <v-list>
      <v-subheader>Holidays List</v-subheader>
      <v-list-item-group
        v-model="selectedItem"
        color="primary"  
        v-if="notAllowedDates.length > 0"      
      >
        <v-list-item
          v-for="(holiday, i) in holidays"
          :key="i"
          
        >
          
          <v-row>
            <v-col cols="6">
              {{i+1}}.  
              {{holidayFormatted(holiday.date)}}
              </v-col>
             <v-col cols="6" class="d-flex justify-end">
               <v-btn text color="red" @click="deleteHoliday(holiday._id)">
                 <v-icon>mdi-delete</v-icon>
               </v-btn>
             </v-col>
          </v-row>
          
        </v-list-item>
      </v-list-item-group>
    </v-list>
  

          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat height="400px">
          <v-card-text>
           <v-form ref="form" v-model="valid" lazy-validation>
          
          <v-card-text>
            <v-container>
             
                 <div class="mb-6">{{dateFormatted}}</div>
             
              <v-row>
                <v-col cols="12" sm="12" xl="6" md="6">
                  <v-dialog
                    ref="dialog"
                    v-model="modal"
                    :return-value.sync="date"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date"
                        label="Choose Holiday Date*"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :value="date"
                      @input="onDateInput"
                      scrollable
                      :allowed-dates="getAllowedDates"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modal = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialog.save(date)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-col>
                
              </v-row>
            </v-container>
            <v-alert v-if="error" type="error" color="red">{{ error }}</v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            
            <v-btn
              color="blue darken-1"
              text
              @click="addHoliday"
              :disabled="!valid"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
          </v-card-text>
        </v-card>
      </v-tab-item>
     
    </v-tabs>
  </v-card>
        
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import moment from "moment";
export default {
  props: ["dialog"],
  data: () => ({
     selectedItem:null,
      items: [
        { text: 'Real-Time' },
        { text: 'Audience' },
        { text: 'Conversions'},
      ],
      tab:0,
      tabs:[
          {index:0,name:"Holidays"},
          {index:1,name:"Add Holiday"}
      ],
    modal: false,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
        days: ["monday", "tuesday","wednesday","thursday", "friday"],
        notAllowedDates:['2022-04-15','2022-04-14'],
    valid: true,
    error: null,
    overlay:false
    
  }),
  computed: {
    holidays(){
      return this.$store.state.holidays;
    },
    holidayDates(){
      var holidays=[];
      this.holidays.map((holiday)=> {
        holidays.push(holiday.date);
      })
      return holidays;
    },
      dateFormatted(){
         return moment(this.date).format("dddd, MMMM Do YYYY");
      },
    addHolidayError() {
      return this.$store.state.error.addHolidayError;
    },
    holidayDeleteError() {
      return this.$store.state.error.holidayDeleteError;
    },
    attendances() {
      return this.$store.state.attendances;
    },
    maxDate() {
      var date = new Date();
      // Add a day
      var nextDayDate = date.setDate(date.getDate());
      var nextDateFormatted = moment(nextDayDate).format("YYYY-MM-DD");
      return nextDateFormatted;
    },
  },
  methods: {
    onDateInput(date){
      this.date=date;
    },
    holidayFormatted(date){
      return moment(date).format("dddd, MMMM Do YYYY");
    },
    deleteHoliday(id){
      this.$store.dispatch("deleteHoliday",id).then(()=> {
        if(this.holidayDeleteError){
          console.log("Error:Deleting Holiday date");
        }else {
          console.log("Holiday successfully delted");
        }
      }).catch((err)=> {
        console.log("Error Deleting Holiday!");
      })
    },
    getAllowedDates(value) {
      const date = moment(value);
      const day = date.format("dddd").toLowerCase();
      const dateToCheck = date.format("YYYY-MM-DD");
      return this.days.includes(day) && !this.holidayDates.includes(dateToCheck);
    },
    close() {
      this.$emit("close", false);
    },
  
   
    
    addHoliday() {
      
      this.$store.dispatch("addHoliday",{date:this.date})
      .then(()=> {
        if(this.addHolidayError){
          this.error="Error saving holiday";
        }else {
          this.tab=0;
          this.error=null;
        }
      }).catch((err)=> {
        console.log(err.message);
        this.error=err.message;
      })
    },
  },
};
</script>