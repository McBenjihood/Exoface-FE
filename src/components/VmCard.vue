<script setup lang="ts">
import { computed } from "vue";
import { vms, type Vm } from "../mockData";
import { vmWerte, balkenFarbe } from "../vmValues";

const props = defineProps<{
  vm: Vm;
  loeschbar?: boolean;
}>();

const werte = computed(() => vmWerte(props.vm));

function startStopVM() {
  props.vm.status = props.vm.status === "active" ? "inactive" : "active";
}

function resetVM() {
  console.log("Reset:", props.vm.name);
}

function deleteVM() {
  const index = vms.findIndex((v) => v.vmID === props.vm.vmID);
  if (index !== -1) {
    vms.splice(index, 1);
  }
}
</script>

<template>
  <div class="vm">
    <router-link :to="'/vm/' + vm.vmID" class="vm-link">
      <div class="vm-kopf">
        <span class="vm-name">{{ vm.name }}</span>
        <span class="status" :class="vm.status">
          {{ vm.status === "active" ? "läuft" : "gestoppt" }}
        </span>
      </div>
      <div class="vm-ip">{{ vm.ip }}</div>

      <div class="werte">
        <div v-for="wert in werte" :key="wert.name" class="wert">
          <div class="wert-zeile">
            <span class="wert-name">{{ wert.name }}</span>
            <span>{{ wert.text }}</span>
          </div>
          <div class="balken">
            <span
                :style="{
                width: wert.prozent + '%',
                backgroundColor: balkenFarbe(wert.prozent),
              }"
            ></span>
          </div>
        </div>
      </div>
    </router-link>

    <div class="vm-buttons">
      <button @click="startStopVM">
        {{ vm.status === "active" ? "Stoppen" : "Starten" }}
      </button>
      <button @click="resetVM">Zurücksetzen</button>
      <button v-if="loeschbar" class="loeschen" @click="deleteVM">Löschen</button>
    </div>
  </div>
</template>

<style scoped>
.vm {
  display: flex;
  gap: 16px;
  padding: 14px 16px;
  border: 1px solid var(--border);
  border-radius: 6px;
}

.vm:hover {
  border-color: var(--primary);
}

.vm-link {
  flex: 1;
  color: inherit;
  text-decoration: none;
}

.vm-kopf {
  display: flex;
  align-items: center;
  gap: 10px;
}

.vm-name {
  font-family: Consolas, "Courier New", monospace;
  font-weight: 600;
}

.status {
  font-size: 13px;
}

.status.active {
  color: var(--success);
}

.status.inactive {
  color: var(--danger);
}

.vm-ip {
  margin-top: 4px;
  font-size: 14px;
  color: var(--text-muted);
}

.werte {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 12px;
}

.wert-zeile {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
}

.wert-name {
  color: var(--text-muted);
}

.balken {
  height: 6px;
  margin-top: 6px;
  overflow: hidden;
  background-color: var(--surface-2);
  border-radius: 3px;
}

.balken span {
  display: block;
  height: 100%;
}

.vm-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vm-buttons button {
  min-width: 120px;
  height: 32px;
  padding: 0 12px;
  font-family: inherit;
  font-size: 14px;
  color: var(--text);
  background-color: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: 6px;
  cursor: pointer;
}

.vm-buttons button:hover {
  background-color: var(--surface-2);
}

.vm-buttons .loeschen:hover {
  color: var(--danger);
  border-color: var(--danger);
}

.vm:hover {
  border-color: var(--primary);
  background-color: var(--primary-soft);
}

@media (max-width: 600px) {
  .vm {
    flex-direction: column;
  }

  .werte {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .vm-buttons {
    flex-direction: row;
  }

  .vm-buttons button {
    min-width: 0;
    flex: 1;
  }
}
</style>