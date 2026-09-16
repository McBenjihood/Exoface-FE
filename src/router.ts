import { createRouter, createWebHistory } from "vue-router";
import LoginView from "./components/LoginView.vue";
import StudentView from "./components/StudentView.vue";
import TeacherView from "./components/TeacherView.vue";
import TeacherClassView from "./components/TeacherClassView.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginView },
    { path: "/studentview", component: StudentView },
    { path: "/teacherview", component: TeacherView },
    { path: "/teacherclassview", component: TeacherClassView }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
