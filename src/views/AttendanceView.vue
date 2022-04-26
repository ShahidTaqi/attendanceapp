<template>
  <div id="app">
    <v-toolbar class="pl-5">
      <v-toolbar-title>Attendance </v-toolbar-title>

      <v-spacer></v-spacer>

      <attendance-table-view
        :row="row"
        :dateRange="dateRangeValue"
        :month="monthFormatted"
        :user="nameFilterValue"
        :dialog="dialogTableView"
        :items="filteredItems"
        :datesArray="datesArray"
        @closeTableView="closeTableView"
      ></attendance-table-view>
     
      <add-holiday
        :dialog="addHolidayDialog"
        @close="closeHolidayDialog"
      ></add-holiday>

      <v-btn
        dark
        color="green"
        class="pr-3 font-weight-bold"
        @click="printPreview"
        text
        x-small
      >
        <v-icon class="pa-2">mdi-file-pdf-box</v-icon>
        <span class="hidden-sm-and-down"> Preview Table</span>
      </v-btn>

      <v-btn
        dark
        color="green"
        class="pl-3 font-weight-bold"
        @click="addHoliday"
        text
        x-small
        v-if="currentUser && currentUser.role.toLowerCase() === 'admin'"
      >
        <v-icon class="pa-2">mdi-calendar-plus</v-icon>
        <span class="hidden-sm-and-down">Holidays</span>
      </v-btn>

      <v-btn
        dark
        color="green"
        class="pl-3 font-weight-bold"
        @click="addAttendance"
        text
        x-small
        v-if="currentUser && currentUser.role.toLowerCase() === 'admin'"
      >
        <v-icon class="pa-2">mdi-plus</v-icon>
        <span class="hidden-sm-and-down"> Add Attendance</span>
      </v-btn>
    </v-toolbar>
    <div v-if="attendances.length < 1" class="d-flex justify-center my-6">
      {{ "No Data to display" }}
    </div>
    <v-data-table
      v-else
      id="attendanceTable"
      :headers="headers"
      :items="attendances"
      item-key="_id"
      class="elevation-1 pa-2"
      :item-class="row_classes"
      loading="$store.getters.isLoadedAttendances"
      loading-text="Loading... Please wait.."
      @current-items="getFiltered"
    >
      <template v-slot:item.srno="{ item }">
        {{
          attendances
            .map(function (x) {
              return x._id;
            })
            .indexOf(item._id) + 1
        }}.
      </template>
      <template v-slot:item.action="{ item }" >

  <v-btn text color="pink" x-small  @click.stop="deleteAttendance(item)" :disabled="currentUser.role.toLowerCase() !== 'admin'" title="Delete Attendance Record">
            <v-icon >
  mdi-delete
</v-icon>
  </v-btn>
     
    </template>
      <template v-slot:item.idNumber="{ item }">
        <span v-if="user(item.idNumber)">{{ user(item.idNumber).name }}</span>
      </template>
       <template v-slot:item.date="{ item }">
        <span >{{ item.date | dateFilter }}</span>
      </template>
      <template v-slot:top>
        <!-- v-container, v-col and v-row are just for decoration purposes. -->
        <v-container fluid>
          <v-row class="d-flex align-baseline">
            <v-col cols="12" sm="12" md="4" lg="4" xl="4" class="d-flex justify-center">
              <v-select
                v-model="nameFilterValue"
                :items="users"
                item-text="name"
                :hint="`${nameFilterValue ? nameFilterValue.email : ''}, ${
                  nameFilterValue ? nameFilterValue.phone : ''
                }`"
                persistent-hint
                item-value="_id"
                label="Select User"
                prepend-icon="mdi-account"
                return-object
                single-line
                @change="onChangeUser"
                style="max-width: 80%"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4" xl="4" class="d-flex justify-center">
              <v-radio-group v-model="row" row @change="onChangeDateRange" class="text-caption text-sm-caption">
                <span class="pr-3 text-caption text-sm-caption">Filter By:</span>
                <v-radio label="Date Range" value="date"></v-radio>
                <v-radio label="Month" value="month"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="12" sm="12" md="4" lg="4" xl="4" class="d-flex justify-center">
              <div :class="{ 'd-none': isRange }">
                <v-dialog
                  ref="dialogMonth"
                  v-model="modalMonth"
                  :return-value.sync="dateFilterValue"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="monthFormatted"
                      label="Attendance Month"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      style="max-width: 80%"
                    ></v-text-field>
                  </template>

                  <v-date-picker
                    v-model="dateFilterValue"
                    type="month"
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modalMonth = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialogMonth.save(dateFilterValue)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </div>

              <div :class="{ 'd-none': !isRange }">
                <v-dialog
                  ref="dialogDate"
                  v-model="modalDate"
                  :return-value.sync="dateRangeValue"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeValue"
                      label="Attendance Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      style="max-width: 80%"
                    ></v-text-field>
                  </template>

                  <v-date-picker
                    v-model="dateRangeValue"
                    range
                    :value="dateRangeValue"
                    @input="onDateInput"
                    scrollable
                    :allowed-dates="getAllowedDates"
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modalDate = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialogDate.save(dateRangeValue)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-data-table>


    <v-row class="py-6">
      <add-attendance
        :dialog="addAttendanceDialog"
        @close="closeAttendanceDialog"
      ></add-attendance>
    </v-row>

  </div>
</template>

<script>
import moment from "moment";
import AddAttendance from "@/components/AddAttendance.vue";
import AttendanceTableView from "@/components/AttendanceTableView.vue";
import AddHoliday from "@/components/AddHoliday.vue";
export default {
  components: {
    AddAttendance,
    AttendanceTableView,
    AddHoliday,
  },
  data() {
    return {
      row: "date",
      isRange: true,
      addAttendanceDialog: false,
      updateAttendanceDialog:false,
      addHolidayDialog: false,
      menu: false,
      modalMonth: false,
      modalDate: false,
      dateFilterValue: new Date().toISOString().substr(0, 7),
      dateRangeValue: [],
      dialogTableView: false,
      nameFilterValue: null,
      filteredItems: [],
      datesArray: [],
      date: [],
      availableDates: [],
      days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      notAllowedDates: [],
    };
  },
    filters:{
    dateFilter(date){
      return moment(date).format("DD-MM-YYYY");
    }
  },
  computed: {
    currentUser(){
        return this.$store.state.user;
      },
    holidays() {
      return this.$store.state.holidays;
    },
    attendanceDeleteError(){
      return this.$store.state.error.attendanceDeleteError;
    },
    holidayDates() {
      var holidays = [];
      this.holidays.map((holiday) => {
        holidays.push(holiday.date);
      });
      return holidays;
    },
    monthFormatted() {
      if (!this.dateFilterValue) {
        return;
      }
      return moment(this.dateFilterValue).format("MMMM, YYYY");
    },
    users() {
      if(this.currentUser && this.currentUser.role.toLowerCase() === 'admin'){
         return this.$store.state.users;
        
      }else {
       var tempUser=[];
       this.nameFilterValue=this.currentUser;
        tempUser.push(this.currentUser);
        return tempUser;
      }
      
    },
    maxDate() {
      var date = new Date();
      // Add a day
      var nextDayDate = date.setDate(date.getDate());
      var nextDateFormatted = moment(nextDayDate).format("YYYY-MM-DD");
      return nextDateFormatted;
    },
    attendances() {
      return this.$store.state.attendances;
    },
    headers() {
      return [
        { text: "Sr.No", value: "srno" },
        {
          text: "Employee Name",
          align: "left",
          sortable: false,
          value: "idNumber",
          filter: this.nameFilter,
        },
        {
          text: "Date",
          value: "date",
          filter: this.dateFilter,
        },
        { text: "In Time", value: "inTime" },
        { text: "Out Time", value: "outTime" },
        { text: "Duty Duration", value: "dutyDuration" },
        { text: "Late Duration", value: "lateDuration" },
        { text: "Actions", value:"action",align: "center",sortable:false },
      ];
    },
  },

  methods: {
    deleteAttendance(att){
      const id=att._id;
      this.$store.dispatch("deleteAttendance",id).then(()=>{
        if(this.attendanceDeleteError){
          alert(this.attendanceDeleteError)
        }else {
          console.log("Attendance deleted successfully!");
        }
      })
    },
    onDateInput(date) {
      this.dateRangeValue = date;
    },
    getAllowedDates(value) {
      const date = moment(value);
      const day = date.format("dddd").toLowerCase();
      const dateToCheck = date.format("YYYY-MM-DD");
      return (
        this.days.includes(day) && !this.holidayDates.includes(dateToCheck)
      );
    },
    closeHolidayDialog(status) {
      this.addHolidayDialog = status;
    },
    allowedDates(a) {
      return this.availableDates.includes(a);
    },
    closeTableView(status) {
      this.dialogTableView = status;
    },
    getFiltered(items) {
      this.filteredItems = items;
    },
    printPreview() {
      this.dialogTableView = true;
    },
    onChangeDateRange() {
      if (this.row === "month") {
        this.isRange = false;
      } else {
        this.isRange = true;
      }
    },
    user(id) {
      return this.users.find((u) => u._id === id);
    },
    onChangeUser() {
      console.log("User is changed");
    },
    row_classes(item) {
      var baseLateTime = "00:00:00";
      console.log(item.lateDuration > baseLateTime);
      if (item.lateDuration > baseLateTime) {
        return "grey";
      } else {
        return "white";
      }
    },
    addAttendance() {
      this.addAttendanceDialog = true;
    },
    addHoliday() {
      this.addHolidayDialog = true;
    },
    closeAttendanceDialog(status) {
      this.addAttendanceDialog = status;
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
      if (!value) {
        console.log("Value is empty");
        return;
      }
      console.log(this.nameFilterValue);
      // Check if the current loop value (The dessert name)
      // partially contains the searched word.
      return value.includes(this.nameFilterValue._id);
    },

    /**
     * Filter for calories column.
     * @param value Value to be tested.
     * @returns {boolean}
     */
    dateFilter(value) {
      var workingDays=this.days;
      var holidayDays=this.holidayDates;
      if (this.row === "month") {
        if (!this.dateFilterValue) {
          return true;
        }

        function getAllDaysInMonth(year, month) {
          const date = new Date(year, month, 1);

          const dates = [];

          while (date.getMonth() === month) {
            const baseDate = moment(date);
            const day = baseDate.format("dddd").toLowerCase();
            const dateToCheck = baseDate.format("YYYY-MM-DD");
            if(workingDays.includes(day) && !holidayDays.includes(dateToCheck)){
              dates.push(moment(new Date(date)).format("YYYY-MM-DD"));
            }
            
            date.setDate(date.getDate() + 1);
          }

          return dates;
        }

        const date1 = new Date(this.dateFilterValue);
        var daysInMonths = getAllDaysInMonth(
          date1.getFullYear(),
          date1.getMonth()
        );
        this.datesArray = daysInMonths;

        return daysInMonths.includes(value);
      } else {
        function getDates(startDate, stopDate) {
          var dateArray = [];
          var currentDate = moment(startDate);
          var stopDate = moment(stopDate);
          while (currentDate <= stopDate) {
            const baseDate = moment(currentDate);
            const day = baseDate.format("dddd").toLowerCase();
            const dateToCheck = baseDate.format("YYYY-MM-DD");
            if(workingDays.includes(day) && !holidayDays.includes(dateToCheck)){
              dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
            }
            
            currentDate = moment(currentDate).add(1, "days");
          }
          return dateArray;
        }
        if (!this.dateRangeValue.length) {
          return true;
        }

        if (this.dateRangeValue.length > 1) {
          if (this.dateRangeValue[0] < this.dateRangeValue[1]) {
            var startDate = this.dateRangeValue[0];
            var endDate = this.dateRangeValue[1];
            var datesRange = getDates(startDate, endDate);
            this.datesArray = datesRange;
            return datesRange.includes(value);
          } else {
            var startDate = this.dateRangeValue[1];
            var endDate = this.dateRangeValue[0];
            var datesRange = getDates(startDate, endDate);
            this.datesArray = datesRange;
            return datesRange.includes(value);
          }
        } else {
          return this.dateRangeValue[0] === value;
        }
      }
    },
  },
};
</script>

<style  scoped>
.orange {
  background-color: #ddd;
  color: white!important;;
}
</style>>
</style>