import { createRouter, createWebHistory } from "vue-router";
import LoginView from "./components/LoginView.vue";
import ResetPasswordView from "./components/ResetPasswordView.vue";
import DashboardView from "./components/DashboardView.vue";

const routes = [
  { path: "/", redirect: "/dashboard" },
  {
    path: "/login",
    component: LoginView,
    meta: { open: true },
  },
  {
    path: "/resetpassword",
    component: ResetPasswordView,
    meta: { open: true },
  },
  { path: "/dashboard", component: DashboardView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
