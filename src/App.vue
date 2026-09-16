<script setup lang="ts">
import { useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";

const route = useRoute();
</script>

<template>
  <Navbar v-if="!route.meta.open" />
  <router-view />
</template>

<style scoped></style>
