import { createRouter, createWebHistory } from "vue-router";
import LoginView from "./components/LoginView.vue";
import StudentView from "./components/StudentView.vue";
import TeacherView from "./components/TeacherView.vue";
import ResetPasswordView from "./components/ResetPasswordView.vue";
import CSV from "./components/CSV.vue";
import TeacherVMDashboard from "./components/TeacherVMDashboard.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginView, meta: { open: true } },
  { path: "/studentview", component: StudentView },
  { path: "/teacherview", component: TeacherView },
  { path: "/csv", component: CSV },

  {
    path: "/resetpassword",
    component: ResetPasswordView,
    meta: { open: true },
  },
  {
    path: "/teacherclassview/:modulName/:klassenTitle",
    name: "teacherclassview",
    component: () => import("./components/TeacherClassView.vue"),
    props: true,
  },
  { path: "/teachervmdashboard", component: TeacherVMDashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
