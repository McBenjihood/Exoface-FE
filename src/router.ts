import { createRouter, createWebHistory } from "vue-router";
import LoginView from "./components/LoginView.vue";
import ResetPasswordView from "./components/ResetPasswordView.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginView },
  { path: "/resetpassword", component: ResetPasswordView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
