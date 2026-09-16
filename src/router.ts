import { createRouter, createWebHistory } from "vue-router";
import LoginView from "./components/LoginView.vue";
import StudentView from "./components/StudentView.vue";
import TeacherView from "./components/TeacherView.vue";
import ResetPasswordView from "./components/ResetPasswordView.vue";
import CSV from "./components/CSV.vue";


const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginView },
    { path: "/studentview", component: StudentView },
    { path: "/teacherview", component: TeacherView },
    { path: "/csv", component: CSV },

    { path: "/resetpassword", component: ResetPasswordView },
    {
        path: '/teacherclassview/:modulName/:klassenTitle',
        name: 'teacherclassview',
        component: () => import('./components/TeacherClassView.vue'),
        props: true
    }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
