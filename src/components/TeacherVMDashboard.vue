<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { vms } from "../mockData";

const props = defineProps<{
  vmID: string;
}>();

const router = useRouter();

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
          width="22"
          height="22"
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
        <span class="status" :class="vm.status">
          {{ vm.status === "active" ? "läuft" : "gestoppt" }}
        </span>

        <div class="buttons">
          <button>SSH Manager</button>
          <button>Zurücksetzen</button>
          <button @click="handleStartStop">
            {{ vm.status === "active" ? "Stoppen" : "Starten" }}
          </button>
        </div>
      </template>
    </div>

    <p v-if="!vm" class="leer">VM nicht gefunden.</p>

    <template v-else>
      <div class="werte">
        <div class="wert">
          <div class="wert-name">CPU</div>
          <div class="wert-zahl">{{ vm.cpu }}</div>
        </div>
        <div class="wert">
          <div class="wert-name">RAM</div>
          <div class="wert-zahl">{{ vm.ram }}</div>
        </div>
        <div class="wert">
          <div class="wert-name">Disk</div>
          <div class="wert-zahl">{{ vm.storage }}</div>
        </div>
      </div>

      <div class="console">
        <div class="console-title">Console</div>
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
  max-width: 860px;
  margin: 0 auto;
  padding: 32px 20px;
}

.top {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.back {
  display: flex;
  padding: 4px;
  color: #12242e;
  background: none;
  border: none;
  cursor: pointer;
}

.back:hover {
  color: #0369a1;
}

.name {
  padding: 3px 10px;
  font-weight: 600;
  background-color: #ffffff;
  border: 1px solid #dde5ea;
  border-radius: 6px;
}

.status {
  font-size: 13px;
}

.status.active {
  color: #16a34a;
}

.status.inactive {
  color: #dc2626;
}

.buttons {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.buttons button {
  height: 32px;
  padding: 0 14px;
  font-family: inherit;
  font-size: 14px;
  color: #12242e;
  background-color: #ffffff;
  border: 1px solid #b8c4cc;
  border-radius: 6px;
  cursor: pointer;
}

.buttons button:hover {
  background-color: #f4f7f9;
}

.werte {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.wert {
  flex: 1;
  padding: 14px 16px;
  background-color: #ffffff;
  border: 1px solid #dde5ea;
  border-radius: 8px;
}

.wert-name {
  font-size: 13px;
  color: #5a6b77;
}

.wert-zahl {
  margin-top: 4px;
  font-size: 18px;
  font-weight: 600;
}

.console {
  min-height: 350px;
  padding: 16px;
  background-color: #12242e;
  border-radius: 8px;
}

.console-title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #dde5ea;
}

.console-text {
  margin: 0;
  font-family: monospace;
  color: #b8c4cc;
}

.leer {
  color: #5a6b77;
}

@media (max-width: 600px) {
  .buttons {
    width: 100%;
    margin-left: 0;
  }

  .buttons button {
    flex: 1;
    padding: 0 6px;
  }

  .werte {
    flex-direction: column;
  }
}
</style>
