<script setup lang="ts">
defineProps<{
  name: "chevron" | "back" | "play" | "stop" | "reset" | "trash" | "sun" | "moon" | "upload";
  size?: number;
}>();
</script>

<template>
  <svg
      :width="size ?? 18" :height="size ?? 18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round"
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
  </svg>
</template>