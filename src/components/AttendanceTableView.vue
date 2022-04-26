<template>
  <v-row justify="center" v-if="$store.getters.isLoadedUsers">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="blue-grey darken-3">
          <v-btn icon dark @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Attendance Table Preview</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="exportToPDF"> Download pdf </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div ref="table" style="text-align: left">
          <v-toolbar>
            <v-toolbar-title
              ><h1 style="text-align: center">
                Attendance Records
              </h1></v-toolbar-title
            >
          </v-toolbar>
          <v-container>
            <v-row class="d-flex justify-center">
              <v-col class="pa-5" cols="4">
                <b
                  >Employee Name:<span v-if="user">{{ user.name }}</span></b
                >
                <b><span v-if="!user">All Employees</span></b>
              </v-col>
              <v-col class="pa-5" cols="3">
                <b v-if="user"
                  >Email:<span v-if="user">{{ user.email }}</span></b
                >
              </v-col>
              <v-col
                class="pa-5 d-flex justify-center"
                cols="5"
                v-if="row === 'month'"
              >
                <b v-if="month"
                  >Attendance Month:<span v-if="month"
                    >{{ month }} ({{ datesArray.length }} days)</span
                  ></b
                >
              </v-col>
              <v-col class="pa-5 d-flex justify-center" cols="5" v-else>
                <b v-if="dateRange.length > 0"
                  ><span v-if="dateRange">{{ dateRangeFormatted }}</span></b
                >
              </v-col>
            </v-row>
          </v-container>

          <v-simple-table dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Sr.No</th>
                  <th class="text-left">Date</th>
                  <th class="text-left">In Time</th>
                  <th class="text-left">Out Time</th>
                  <th class="text-left">Duty Duration</th>
                  <th class="text-left">Late Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in items"
                  :key="item._id"
                  :class="{ lateClass: isLateDuration(item) }"
                >
                  <td>{{ index + 1 }}</td>
                  <!-- <td>{{ users.find((u)=>u._id === item.idNumber).name }}</td> -->
                  <td>{{ item.date | dateFilter }}</td>
                  <td>{{ item.inTime }}</td>
                  <td>{{ item.outTime }}</td>
                  <td>{{ item.dutyDuration }}</td>
                  <td>{{ item.lateDuration }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import html2pdf from "html2pdf.js";
import moment from "moment";
export default {
  props: ["dialog", "items", "user", "month", "dateRange", "row", "datesArray"],
  data() {
    return {};
  },
  computed: {
    dateRangeFormatted() {
      if (!this.dateRange.length) {
        return;
      }
      if (this.dateRange.length === 1) {
        return (
          "Attendance Date:" + moment(this.dateRange[0]).format("DD-MM-YYYY")
        );
      }
      var start, end;
      if (this.dateRange[0] < this.dateRange[1]) {
        start = moment(this.dateRange[0]).format("DD-MM-YYYY");
        end = moment(this.dateRange[1]).format("DD-MM-YYYY");
      } else {
        start = moment(this.dateRange[1]).format("DD-MM-YYYY");
        end = moment(this.dateRange[0]).format("DD-MM-YYYY");
      }
      return (
        "Date Range:" +
        start +
        " - " +
        end +
        " (" +
        this.datesArray.length +
        " days)"
      );
    },
    users() {
      return this.$store.state.users;
    },
    fileName() {
      if (this.row === "date") {
        if (this.dateRange.length === 1) {
          if (!this.user) {
            return "All Employees (" + this.dateRange[0] + ")";
          } else {
            return this.user.name + "(" + this.dateRange[0] + ")";
          }
        }
        if (!this.user && !this.dateRange.length) {
          return "All Employees";
        } else if (this.user && !this.dateRange.length) {
          return this.user.name;
        } else if (!this.user && this.dateRange.length) {
          if (this.dateRange[0] < this.dateRange[1]) {
            return (
              "All Employees (" +
              this.dateRange[0] +
              " - " +
              this.dateRange[1] +
              ")"
            );
          } else {
            return (
              "All Employees (" +
              this.dateRange[1] +
              " - " +
              this.dateRange[0] +
              ")"
            );
          }
        } else {
          return (
            this.user.name +
            " (" +
            this.dateRange[1] +
            " - " +
            this.dateRange[0] +
            ")"
          );
        }
      } else if (this.row === "month") {
        if (!this.user && !this.month) {
          return "All Employees";
        } else if (!this.user && this.month) {
          return "All Employees (" + this.month + ")";
        } else if (this.user && !this.month) {
          return this.user.name;
        } else {
          return this.user.name + " (" + this.month + ")";
        }
      }
    },
  },
  filters: {
    dateFilter(date) {
      return moment(date).format("DD-MM-YYYY");
    },
  },
  methods: {
    isLateDuration(item) {
      var baseLateTime = "00:00:00";
      if (item.lateDuration > baseLateTime) {
        return true;
      } else {
        return false;
      }
    },
    exportToPDF() {
      html2pdf(this.$refs.table, {
        margin: 1,
        filename: this.fileName + ".pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { dpi: 192, letterRendering: true },
        jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
      });
    },
    print() {
      this.$htmlToPaper("printMe");
    },
    close() {
      this.$emit("closeTableView", false);
    },
  },
};
</script>

<style scoped>
v-simple-table th,
th,
td {
  border: 1px solid darkgray;
}
.lateClass {
  background-color: darkgrey;
  color: white;
}
</style>