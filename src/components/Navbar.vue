<script setup lang="ts"></script>
<template>
  <nav class="navbar">
    <router-link class="logo" to="/">Exoface</router-link>

    <div class="links">
      <router-link to="/student">Meine VMs</router-link>
      <router-link to="/teacher">Klassen</router-link>
      <router-link to="/login">Login</router-link>
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

.links {
  display: flex;
  gap: 25px;
}

.links a {
  color: #12242e;
  text-decoration: none;
}
</style>
