<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { getUser, logout } from "../auth";
import { theme, toggleTheme } from "../theme";
import Icon from "./Icon.vue";

const router = useRouter();
const open = ref(false);
const user = getUser();
const dropdown = ref<HTMLElement | null>(null);

const rolle = computed(() =>
    user?.role === "teacher" ? "Lehrperson" : "Lernende Person",
);

function schliessen(e: MouseEvent) {
  if (dropdown.value && !dropdown.value.contains(e.target as Node)) {
    open.value = false;
  }
}

onMounted(() => document.addEventListener("click", schliessen));
onUnmounted(() => document.removeEventListener("click", schliessen));

function handleLogout() {
  logout();
  router.push("/login");
}
</script>
<template>
  <nav class="navbar">
    <router-link class="logo" to="/">
      <img src="/logo.png" alt="logo" />
    </router-link>

    <button
        class="theme-btn"
        @click="toggleTheme"
        :title="theme === 'dark' ? 'Hell' : 'Dunkel'"
    >
      <Icon :name="theme === 'dark' ? 'sun' : 'moon'" :size="22" />
    </button>

    <div class="dropdown" ref="dropdown">
      <button class="avatar" @click="open = !open" title="Profil">
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 5.5c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4.5c-.83 0-1.5-.67-1.5-1.5S9.17 7 10 7s1.5.67 1.5 1.5S10.83 10 10 10z" />
          <path d="M10 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14.5c-1.49 0-2.86-.51-3.96-1.36C7.19 14.42 8.55 14 10 14s2.81.42 3.96 1.14c-1.1.85-2.47 1.36-3.96 1.36zm5.07-2.44c-1.44-.99-3.19-1.56-5.07-1.56s-3.62.58-5.07 1.56C4.04 12.95 3.5 11.54 3.5 10c0-3.58 2.92-6.5 6.5-6.5s6.5 2.92 6.5 6.5c0 1.54-.54 2.95-1.43 4.06z" />
        </svg>
      </button>

      <div v-if="open" class="menu">
        <div class="email">
          <div class="name">{{ user?.name }}</div>
          <div>{{ rolle }}</div>
          {{ user?.email }}
        </div>

        <a href="/login" @click.prevent="handleLogout" class="logout"
        >Abmelden</a
        >
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  background-color: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
}

.logo {
  font-size: 23px;
  font-weight: bold;
  color: var(--primary);
  text-decoration: none;
}

.logo img {
  height: 35px;
  width: auto;
  display: block;
}

.theme-btn {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  color: var(--text);
  background: none;
  border: none;
  cursor: pointer;
}

.dropdown {
  position: relative;
}

.avatar {
  display: block;
  height: 35px;
  width: 35px;
  padding: 0;
  color: var(--text);
  background: none;
  border: none;
  cursor: pointer;
}

.avatar svg {
  height: 100%;
  width: 100%;
  display: block;
}

.menu {
  position: absolute;
  right: 0;
  top: 45px;
  min-width: 200px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 6px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.14);
}
.email {
  padding: 8px 10px 10px;
  font-size: 12px;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border);
  margin-bottom: 4px;
}
.name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}
.menu a {
  display: block;
  padding: 8px 10px;
  border-radius: 6px;
  color: var(--text);
  text-decoration: none;
}

.menu a.logout {
  color: var(--danger);
}

.menu a:hover {
  background: var(--surface-2);
}
</style>