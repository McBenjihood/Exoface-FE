<script setup lang="ts"></script>
<template>
  <nav class="navbar">
    <router-link class="logo" to="/">
      <img src="/logo.png" alt="logo" />
    </router-link>

    <button class="avatar"><img src="/avatar.svg" /></button>
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
</style>
