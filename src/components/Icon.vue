<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  name:
      | "chevron" | "back" | "play" | "stop" | "reset" | "trash"
      | "sun" | "moon" | "upload" | "eye" | "eye-off";
  size?: number;
}>();

// Icons von Google
const material = computed(() => props.name === "eye" || props.name === "eye-off");
</script>

<template>
  <svg
      :width="size ?? 18" :height="size ?? 18"
      :viewBox="material ? '0 -960 960 960' : '0 0 24 24'"
      :fill="material ? 'currentColor' : 'none'"
      :stroke="material ? 'none' : 'currentColor'"
      stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round"
      aria-hidden="true"
  >
    <path v-if="name === 'chevron'" d="M6 9l6 6 6-6" />
    <path v-else-if="name === 'back'" d="M15 18l-6-6 6-6" />
    <polygon v-else-if="name === 'play'" points="7 4 20 12 7 20" />
    <rect v-else-if="name === 'stop'" x="7" y="7" width="10" height="10" rx="1" />
    <path v-else-if="name === 'reset'" d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />
    <path v-else-if="name === 'trash'" d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
    <g v-else-if="name === 'sun'">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </g>
    <path v-else-if="name === 'moon'" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    <path v-else-if="name === 'upload'" d="M12 16V4m0 0L8 8m4-4l4 4M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />

    <!-- Material Symbols "visibility" -->
    <path v-else-if="name === 'eye'" d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />

    <!-- Material Symbols "visibility_off" -->
    <path v-else-if="name === 'eye-off'" d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
  </svg>
</template>