import { createRouter, createWebHistory } from "vue-router";
import LoginView from "./components/LoginView.vue";
import ResetPasswordView from "./components/ResetPasswordView.vue";
import TeacherVMDashboard from "./components/TeacherVMDashboard.vue";
import { getUser } from "./auth.ts";
import OverviewView from "./components/OverviewView.vue";

const routes = [
  { path: "/", redirect: "/overview" },
  { path: "/login", component: LoginView, meta: { open: true } },
  { path: "/overview", component: OverviewView },
  {
    path: "/csv",
    name: "csv",
    component: () => import("./components/CSV.vue"),
    meta: { role: "teacher" },
  },
  {
    path: "/resetpassword",
    component: ResetPasswordView,
    meta: { open: true },
  },
  {
    path: "/class/:modulName/:klassenTitle",
    name: "classview",
    component: () => import("./components/TeacherClassView.vue"),
    props: true,
    meta: { role: "teacher" },
  },
  {
    path: "/vm/:vmID",
    name: "vm",
    component: TeacherVMDashboard,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  if (to.meta.open) return true;

  const user = getUser();
  if (!user) return "/login";

  if (to.meta.role && to.meta.role !== user.role) return "/overview";
});

export default router;
