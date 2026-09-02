import { createRouter, createWebHistory } from "vue-router";
import LoginView from "./components/LoginView.vue";
import StudentView from "./components/StudentView.vue";
import TeacherView from "./components/TeacherView.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
