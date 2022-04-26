import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import cookie from 'vue-cookies'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        users: [],
        attendances: [],
        holidays:[],
        error: {},
        user: null
    },
    getters: {
        isLoadedUsers:(state)=> !!state.users.length,
        isLoadedAttendances:(state)=> !!state.attendances.length,
        userById: (state) => (id) => {
            return state.users.find((user) => {
                return user._id === id;
            })
        },
        attendanceById: (state) => (id) => {
            return state.attendances.find((att) => {
                return att._id === id;
            })
        },
        attendanceByUser: (state) => (id) => {
            return state.attendances.filter((att) => {
                return att.idNumber === id;
            })
        },
    },
    mutations: {
        setAttendances(state, attendances) {
            state.attendances = attendances;
        },
        setAttendance(state, attendance) {
            state.attendances.push(attendance);
            console.log(state.attendances);
        },
        setHolidays(state, holidays) {
            state.holidays = holidays;
        },
        setHoliday(state, holiday) {
            state.holidays.push(holiday);
        },
        setUsers(state, users) {
            state.users = users;
        },
        setUser(state, user) {
            state.users.push(user);
        },
        setCurrentUser(state, user) {
            state.user = user;
        },
        setError(state, error) {
            state.error = error;
        },
        deleteUser(state, id) {
            const index = state.users.findIndex((u) => {
                return u._id === id;
            });
            Vue.delete(state.users, index);
        },
        deleteAttendance(state, id) {
            const index = state.attendances.findIndex((att) => {
                return att._id === id;
            });
            Vue.delete(state.attendances, index);
        },
        deleteHoliday(state, id) {
            const index = state.holidays.findIndex((h) => {
                return h._id === id;
            });
            Vue.delete(state.holidays, index);
        },
        editUser(state, user) {
            const index = state.users.findIndex((u) => {
                return u._id === user._id;
            });
            Vue.set(state.users, index, user);
        },
    },
    actions: {
        async editUser({ commit }, userData) {
            commit("setError", {});
            const userId = userData.id;
            const user=userData.user;
            console.log(user);
            let result = (
                await axios.patch(
                    `http://localhost:3000/users/${userId}`,
                    user
                )
            ).data;
            if (result.user) {
                commit("editUser", result.user);
            } else if (result.errors) {
                commit("setError", { editUserError: result.errors });
            }
        },
        async addHoliday({ commit }, holidayData) {
            commit("setError", {});

            let data = (
                await axios.post("http://localhost:3000/holidays", holidayData)
            ).data;

            if (data.errors) {
                commit("setError", { addHolidayError: data.errors });
            } else if (data.holiday) {
                commit("setHoliday", data.holiday);
            }
        },
        async addAttendance({ commit }, attendanceData) {
            commit("setError", {});

            let data = (
                await axios.post("http://localhost:3000/attendances", attendanceData)
            ).data;

            if (data.errors) {
                commit("setError", { addAttendanceError: data.errors });
            } else if (data.attendance) {
                commit("setAttendance", data.attendance);
            }
        },
        async addUser({ commit }, registerData) {
            commit("setError", {});

            let data = (
                await axios.post("http://localhost:3000/signup", registerData)
            ).data;

            if (data.errors) {
                commit("setError", { addUserError: data.errors });
            } else if (data.user) {
                commit("setUser", data.user);
                commit("setCurrentUser", data.user);
                cookie.set('user',data.user);
            }
        },
        async deleteUser({ commit }, id) {
            commit("setError", "");
            let data = (await axios.delete(`http://localhost:3000/users/${id}`)).data;
            if (data.success) {
                console.log(data.success);
                commit("deleteUser", id);
            } else {
                console.log(data.success);
                commit("setError", { userDeleteError: "Error Deleting user" });
            }
        },
        async deleteHoliday({ commit }, holidayId) {
            commit("setError", "");
            let data = (await axios.delete(`http://localhost:3000/holidays/${holidayId}`)).data;
            if (data.success) {
                console.log(data.success);
                commit("deleteHoliday", holidayId);
            } else {
                commit("setError", { holidayDeleteError: "Error Deleting Holiday" });
            }
        },
        async deleteAttendance({ commit }, attendanceId) {
            commit("setError", "");
            let data = (await axios.delete(`http://localhost:3000/attendances/${attendanceId}`)).data;
            if (data.success) {
                console.log(data.success);
                commit("deleteAttendance", attendanceId);
            } else {
                commit("setError", { attendanceDeleteError: "Error Deleting attendance" });
            }
        },
        async loginUser({ commit }, loginData) {
            commit("setError", { email: "", password: "" });

            let data = (await axios.post("http://localhost:3000/login", loginData))
                .data;

            if (data.errors) {
                commit("setError", {
                    email: data.errors.email,
                    password: data.errors.password,
                });
            } else if (data.user) {
                const user = cookie.set('user', data.user);
                console.log(user);
                commit("setCurrentUser", data.user);
            }
        },
        async getUsers({ commit }) {
            const user = cookie.get('user');
            console.log(user);
            if (user) {
                commit("setCurrentUser", user);
            }
            console.log(user);
            let result = (await axios.get("http://localhost:3000/users",{timeout:10000})).data;
            console.log(result.errors);
            if (result.users) {
                commit("setUsers", result.users);
            } else if (result.errors) {
                const error = { userError: "Error getting users!" };
                commit("setError", error);
            }
        },
        async getAttendances({ commit }) {


            let result = (await axios.get("http://localhost:3000/attendances")).data;
            console.log(result.attendances);
            if (result.attendances) {
                commit("setAttendances", result.attendances);
            } else if (result.errors) {
                const error = { attendancesError: "Error getting attendances!" };
                alert(error);
                commit("setError", error);
            }
        },
        async getHolidays({ commit }) {


            let result = (await axios.get("http://localhost:3000/holidays")).data;
            if (result.holidays) {
                commit("setHolidays", result.holidays);
            } else if (result.errors) {
                const error = { HolidaysError: "Error getting holidays!" };
                alert(error);
                commit("setError", error);
            }
        },
        logout({commit}){
            commit("setCurrentUser",null);
        }
    },
    modules: {},
});