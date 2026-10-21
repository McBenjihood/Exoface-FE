<script setup lang="ts">
import { getUser } from "../auth";
import TeacherView from "./TeacherView.vue";
import StudentView from "./StudentView.vue";

const user = getUser();
</script>

<template>
  <TeacherView v-if="user?.role === 'teacher'" />
  <StudentView v-else-if="user?.role === 'student'" />
</template>
