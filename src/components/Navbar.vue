<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
const email = ref("lehrer@exoface.ch");
</script>
<template>
  <nav class="navbar">
    <router-link class="logo" to="/">
      <img src="/logo.png" alt="logo" />
    </router-link>

    <div class="dropdown">
      <button class="avatar" @click="open = !open">
        <img src="/avatar.svg" alt="avatar" />
      </button>

      <div v-if="open" class="menu">
        <div class="email">{{ email }}</div>

        <router-link to="/login" class="logout">Abmelden</router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  gap: 35px;
  padding: 15px 20px;
  background-color: #f4f7f9;
  border-bottom: 1px solid #dde5ea;
}

.logo {
  font-size: 23px;
  font-weight: bold;
  color: #009fe3;
  text-decoration: none;
}

.logo img {
  height: 35px;
  width: auto;
  display: block;
}

.dropdown {
  margin-left: auto;
  position: relative;
}

.avatar {
  margin-left: auto;
  height: 35px;
  width: 35px;
  padding: 0;
  border-radius: 50%;
  overflow: hidden;
  background: none;
  border: none;
  cursor: pointer;
}

.avatar img {
  height: 100%;
  width: 100%;
  display: block;
}

.menu {
  position: absolute;
  right: 0;
  top: 45px;
  min-width: 160px;
  background: white;
  border: 1px solid #dde5ea;
  border-radius: 8px;
  padding: 6px;
}
.email {
  padding: 8px 10px 10px;
  font-size: 12px;
  color: #5a6b77;
  border-bottom: 1px solid #dde5ea;
  margin-bottom: 4px;
}
.menu a {
  display: block;
  padding: 8px 10px;
  color: #333;
  text-decoration: none;
}

.menu a.logout {
  color: red;
}

.menu a:hover {
  background: #5a6b77;
}
</style>
