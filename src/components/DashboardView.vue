<script setup lang="ts">
import { ref } from "vue";
import TeacherView from "./TeacherView.vue";
import StudentView from "./StudentView.vue";

const role = ref("teacher");
</script>

<template>
  <TeacherView v-if="role === 'teacher'" />
  <StudentView v-if="role === 'student'" />
</template>

<style scoped></style>
