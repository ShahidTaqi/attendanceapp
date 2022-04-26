import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UsersView from '../views/UsersView.vue'
import AttendanceView from '../views/AttendanceView.vue'
import Login from '../views/Login.vue'
import cookie from 'vue-cookies'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: "/users",
        name: "users",
        component: UsersView
    },
    {
        path: "/attendance",
        name: "Attendance",
        component: AttendanceView
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    const user=cookie.get('user');
    if (to.name !== 'Login' && !user) next({ name: 'Login' })
    // if the user is not authenticated, `next` is called twice
    next()
  })

export default router