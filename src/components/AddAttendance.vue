<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-toolbar>
            <v-toolbar-title>Add Attendance Record</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col class="d-flex justify-end mr-6">
                  <v-checkbox
                    v-model="leave"
                    label="Leave"
                    color="primary"
                    value="leave"
                    hide-details
                    @change="onChangeLeave"
                  ></v-checkbox>
                </v-col>
              </v-row>
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
                        label="Choose Attendance Date*"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      scrollable
                      @change="onChangeDate"
                      :max="maxDate"
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
                <v-col cols="12" sm="12" xl="6" md="6">
                  <v-select
                    v-model="user"
                    :items="$store.state.users"
                    item-text="name"
                    item-value="_id"
                    label="Select User*"
                    prepend-icon="mdi-account"
                    return-object
                    single-line
                    @change="onChangeUser"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="12" xl="6" md="6">
                  <v-dialog
                    ref="inTimeDialog"
                    v-model="modalInTime"
                    :return-value.sync="inTime"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="inTime"
                        label="Pick In Time*"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="modalInTime"
                      v-model="inTime"
                      format="ampm"
                      ampm-in-title
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modalInTime = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.inTimeDialog.save(inTime)"
                      >
                        OK
                      </v-btn>
                    </v-time-picker>
                  </v-dialog>
                </v-col>
                <v-col cols="12" sm="12" xl="6" md="6">
                  <v-dialog
                    ref="outTimeDialog"
                    v-model="modalOutTime"
                    :return-value.sync="outTime"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="outTime"
                        label="Pick Out Time*"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker v-if="modalOutTime" v-model="outTime">
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modalOutTime = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.outTimeDialog.save(outTime)"
                      >
                        OK
                      </v-btn>
                    </v-time-picker>
                  </v-dialog>
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
              @click="addAttendance"
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
import moment from "moment";
export default {
  props: ["dialog"],
  data: () => ({
    modal: false,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
        days: ["monday", "tuesday","wednesday","thursday", "friday"],
        notAllowedDates:['2022-04-15','2022-04-14'],
    valid: true,
    dateRules: [(v) => !!v || "Date is required"],
    user: null,
    userRules: [(v) => !!v || "User is required"],
    inTime: null,
    inTimeRules: [(v) => !!v || "In Time is required"],
    outTime: null,
    outTimeRules: [(v) => !!v || "Out Time is required"],
    error: null,
    modalOutTime: false,
    modalInTime: false,
    duplicateError: null,
    leave: null,
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
    addAttendanceError() {
      return this.$store.state.error.addAttendanceError;
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
    getAllowedDates(value) {
      const date = moment(value);
      const day = date.format("dddd").toLowerCase();
      const dateToCheck = date.format("YYYY-MM-DD");
      return this.days.includes(day) && !this.holidayDates.includes(dateToCheck);
    },
    close() {
      this.$emit("close", false);
    },
    onChangeLeave() {},
    onChangeUser(user) {
      var isDuplicate = this.attendances.find((attendance) => {
        return (
          attendance.date === this.date && attendance.idNumber === user._id
        );
      });
      if (isDuplicate) {
        this.duplicateError =
          "Duplicate Entry:This attendance with the same date and user is entered before!";
      } else {
        this.duplicateError = null;
      }
    },
    onChangeDate() {
      if (!this.user) {
        return;
      }
      var isDuplicate = this.attendances.find((attendance) => {
        return (
          attendance.date === this.date && attendance.idNumber === this.user._id
        );
      });
      if (isDuplicate) {
        this.duplicateError =
          "Duplicate Entry:This attendance with the same date and user is entered before!";
      } else {
        this.duplicateError = null;
      }
    },
    addAttendance() {
      if (this.duplicateError) {
        alert("Duplicate Entry is present");
        return;
      }
      var baseTime = moment("09:00:00", "HH:mm:ss a");
      if (!this.date || !this.inTime || !this.outTime || !this.user) {
        alert("Please Select all fields to proceed!");
        return;
      }

      var startTime = moment(this.inTime, "HH:mm:ss a");
      var endTime = moment(this.outTime, "HH:mm:ss");
      var baseTimeOut = moment("17:00:00", "HH:mm:ss");
      var formattedBaseTimeOut = moment(baseTimeOut)
        .locale("en")
        .format("HH:mm:ss");
      var formattedEndTime = moment(endTime).locale("en").format("HH:mm:ss");
      if (formattedEndTime > formattedBaseTimeOut) {
        endTime = moment("17:00:00", "HH:mm:ss");
      }

      var duration = moment.duration(endTime.diff(startTime));

      var lateDuration = moment.duration(startTime.diff(baseTime));
      var lateTimeDuration = null;
      var dutyDuration = null;
      if (lateDuration < 0) {
        lateTimeDuration = moment("00:00:00", "HH:mm:ss a");
      } else {
        // duration in hours
        var hoursLateDuration = parseInt(lateDuration.asHours());

        var hoursLateDurationString = hoursLateDuration + "";
        if (hoursLateDurationString.length < 2) {
          hoursLateDurationString = "0" + hoursLateDurationString;
        }

        // duration in minutes
        var minutesLateDuration = parseInt(lateDuration.asMinutes()) % 60;
        var minutesLateDurationString = minutesLateDuration + "";
        if (minutesLateDurationString.length < 2) {
          minutesLateDurationString = "0" + minutesLateDurationString;
        }

        var formattedLateDuration =
          hoursLateDurationString + ":" + minutesLateDurationString + ":00";
        var m = moment(formattedLateDuration, "HH:mm:ss");

        lateTimeDuration = moment(m).locale("en").format("HH:mm:ss");
      }

      if (duration < 0) {
        dutyDuration = moment("00:00:00", "HH:mm:ss a");
      } else {
        // duration in hours
        var hoursDutyDuration = parseInt(duration.asHours());

        var hoursDutyDurationString = hoursDutyDuration + "";
        if (hoursDutyDurationString.length < 2) {
          hoursDutyDurationString = "0" + hoursDutyDurationString;
        }

        // duration in minutes
        var minutesDutyDuration = parseInt(duration.asMinutes()) % 60;
        var minutesDutyDurationString = minutesDutyDuration + "";
        if (minutesDutyDurationString.length < 2) {
          minutesDutyDurationString = "0" + minutesDutyDurationString;
        }

        var formattedDutyDuration =
          hoursDutyDurationString + ":" + minutesDutyDurationString + ":00";
        var dutyDurationFormatted = moment(formattedDutyDuration, "HH:mm:ss");

        dutyDuration = moment(dutyDurationFormatted)
          .locale("en")
          .format("HH:mm:ss");
        var inTimeFormatted = moment(startTime).locale("en").format("HH:mm:ss");
        var outTimeFormatted = moment(endTime).locale("en").format("HH:mm:ss");
        const attendanceData = {
          date: this.date,
          user: this.user,
          inTime: inTimeFormatted,
          outTime: outTimeFormatted,
          lateDuration: lateTimeDuration,
          dutyDuration: dutyDuration,
        };
        //console.log(attendanceData);
        this.$store.dispatch("addAttendance", attendanceData).then(() => {
          if (this.addAttendanceError) {
            this.error = "Error:Attendance doesn't added";
          } else {
            this.$refs.form.reset();
            this.$emit("close", false);
          }
        });
      }
    },
  },
};
</script>