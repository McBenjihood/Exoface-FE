<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { vms } from "../mockData";

const props = defineProps<{
  vmID: string;
}>();

const router = useRouter();

// VM aus den Testdaten über die ID in der URL suchen
const vm = computed(() => vms.find((v) => v.vmID === Number(props.vmID)));

function handleStartStop() {
  if (!vm.value) return;
  vm.value.status = vm.value.status === "active" ? "inactive" : "active";
}
</script>

<template>
  <main class="page">
    <div class="top">
      <button class="back" @click="router.back()">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <template v-if="vm">
        <span class="name">{{ vm.studentName }}</span>
        <span
          class="dot"
          :class="vm.status === 'active' ? 'green' : 'red'"
        ></span>

        <div class="buttons">
          <button class="btn">SSH Manager</button>
          <button class="btn">Reset</button>
          <button class="btn" @click="handleStartStop">
            {{ vm.status === "active" ? "Stop" : "Start" }}
          </button>
        </div>
      </template>
    </div>

    <p v-if="!vm">VM nicht gefunden.</p>

    <template v-else>
      <div class="cards">
        <div class="card">
          <p class="label">CPU</p>
          <p class="value">{{ vm.cpu }}</p>
        </div>
        <div class="card">
          <p class="label">RAM</p>
          <p class="value">{{ vm.ram }}</p>
        </div>
        <div class="card">
          <p class="label">DISK</p>
          <p class="value">{{ vm.storage }}</p>
        </div>
      </div>

      <div class="console">
        <p class="console-title">Console</p>
        <p v-if="vm.status === 'active'" class="console-text">
          Konsole wird verbunden ...
        </p>
        <p v-else class="console-text">VM ist gestoppt.</p>
      </div>
    </template>
  </main>
</template>

<style scoped>
.page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  color: #2d3748;
}

.top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.back {
  display: flex;
  padding: 4px;
  color: #2d3748;
  background: none;
  border: none;
  cursor: pointer;
}

.back:hover {
  opacity: 0.7;
}

.name {
  padding: 3px 12px;
  font-weight: 600;
  border: 2px solid #2d3748;
  border-radius: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.green {
  background-color: #38a169;
}

.red {
  background-color: #e53e3e;
}

.buttons {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.btn {
  padding: 8px 16px;
  font-size: 14px;
  color: #2d3748;
  background-color: white;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  cursor: pointer;
}

.btn:hover {
  background-color: #edf2f7;
}

.cards {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.card {
  flex: 1;
  padding: 16px 20px;
  background-color: white;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.label {
  margin: 0 0 4px;
  font-size: 13px;
  color: #718096;
}

.value {
  margin: 0;
  font-weight: 600;
}

.console {
  min-height: 350px;
  padding: 16px 20px;
  background-color: #1a202c;
  border-radius: 8px;
}

.console-title {
  margin: 0 0 16px;
  font-weight: 600;
  color: #e2e8f0;
}

.console-text {
  margin: 0;
  font-family: monospace;
  color: #a0aec0;
}
</style>
