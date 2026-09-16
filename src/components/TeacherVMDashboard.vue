<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const active = ref(true);
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

      <span class="name">Max Muster</span>
      <span v-if="active" class="dot green"></span>
      <span v-else class="dot red"></span>

      <div class="buttons">
        <button class="btn">SSH Manager</button>
        <button class="btn">Reset</button>
        <button class="btn" @click="active = !active">
          <span v-if="active">Stop</span>
          <span v-else>Start</span>
        </button>
      </div>
    </div>

    <div class="cards">
      <div class="card">
        <p class="label">CPU</p>
        <p class="value">50 / 100%</p>
      </div>
      <div class="card">
        <p class="label">RAM</p>
        <p class="value">5 GB / 16 GB</p>
      </div>
      <div class="card">
        <p class="label">DISK</p>
        <p class="value">50 GB / 100 GB</p>
      </div>
    </div>

    <div class="console">
      <p class="console-title">Console</p>
      <p v-if="active" class="console-text">Konsole wird verbunden ...</p>
      <p v-else class="console-text">VM ist gestoppt.</p>
    </div>
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
