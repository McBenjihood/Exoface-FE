<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { getUser } from "../auth";
import { vms, type Vm } from "../mockData";

const router = useRouter();

const user = getUser();

const dbData = ref({
  modules: [
    {
      moduleID: 1,
      abbreviation: "M111",
      description: "Netzwerke und Serverinfrastruktur",
    },
    {
      moduleID: 2,
      abbreviation: "M183",
      description: "Applikationssicherheit implementieren",
    },
    { moduleID: 3, abbreviation: "M306", description: "IT-Projekte abwickeln" },
  ],
  class: [
    { classID: 1, name: "D24a" },
    { classID: 2, name: "D24b" },
  ],
  ClassModule: [
    { moduleID: 1, classID: 1 },
    { moduleID: 1, classID: 2 },
    { moduleID: 2, classID: 1 },
    { moduleID: 3, classID: 1 },
  ],
  Students: [
    {
      studentID: 104,
      name: "Jan Huppertz",
      email: "jan.huppertz@sluz.ch",
      enabled: true,
      classID: 1,
    },
  ],
});

const openModules = ref<number[]>([1]);

const currentStudent = computed(() =>
  dbData.value.Students.find((s) => s.email === user?.email),
);

const displayModules = computed(() => {
  if (!currentStudent.value) return [];

  const classModuleIDs = dbData.value.ClassModule.filter(
    (cm) => cm.classID === currentStudent.value?.classID,
  ).map((cm) => cm.moduleID);

  return dbData.value.modules
    .filter((m) => classModuleIDs.includes(m.moduleID))
    .map((m) => {
      const vm = vms.find(
        (v) =>
          v.moduleID === m.moduleID &&
          v.studentID === currentStudent.value?.studentID,
      );

      return {
        moduleID: m.moduleID,
        name: m.abbreviation,
        description: m.description,
        vm,
      };
    });
});

function toggleModul(moduleID: number) {
  if (openModules.value.includes(moduleID)) {
    openModules.value = openModules.value.filter((id) => id !== moduleID);
  } else {
    openModules.value.push(moduleID);
  }
}

function startStopVM(vm: Vm) {
  vm.status = vm.status === "active" ? "inactive" : "active";
}

function resetVM(vm: Vm) {
  console.log("Reset:", vm.name);
}

function deleteVM(vmID: number) {
  const index = vms.findIndex((v) => v.vmID === vmID);
  if (index !== -1) {
    vms.splice(index, 1);
  }
}

function pushtovmview(vmID: number) {
  router
    .push({
      name: "vm",
      params: {
        vmID: vmID,
      },
    })
    .catch((err) => {
      console.error("Router-Fehler:", err);
    });
}
</script>

<template>
  <main class="dashboard">
    <h1 class="page-title">Hallo {{ user?.name }}</h1>

    <div
      v-for="modul in displayModules"
      :key="modul.moduleID"
      class="modul-box-large"
    >
      <div class="modul-header" @click="toggleModul(modul.moduleID)">
        <div class="modul-title">
          <span class="badge-outline">{{ modul.name }}</span>
          <span class="modul-description">{{ modul.description }}</span>
        </div>

        <svg
          class="chevron"
          :class="{ open: openModules.includes(modul.moduleID) }"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      <template v-if="openModules.includes(modul.moduleID)">
        <div
          v-if="modul.vm"
          @click="pushtovmview(modul.vm.vmID)"
          class="vm-card"
        >
          <div class="vm-info">
            <div class="vm-name">
              <span>{{ modul.vm.name }}</span>
              <span class="status-dot" :class="modul.vm.status"></span>
            </div>
            <span class="ip-address">{{ modul.vm.ip }}</span>
            <span class="uptime">uptime: {{ modul.vm.uptime }}</span>

            <div class="metrics-row">
              <div class="metric-item">
                <span class="metric-icon">💻</span>
                <span>{{ modul.vm.cpu }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-icon">📊</span>
                <span>{{ modul.vm.ram }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-icon">💾</span>
                <span>{{ modul.vm.storage }}</span>
              </div>
            </div>
          </div>

          <div class="action-buttons" @click.stop>
            <button @click="startStopVM(modul.vm)" class="btn btn-action">
              {{ modul.vm.status === "active" ? "Stop" : "Start" }}
            </button>
            <button @click="resetVM(modul.vm)" class="btn btn-action">
              Reset
            </button>
            <button
              @click="deleteVM(modul.vm.vmID)"
              class="btn btn-action btn-danger"
            >
              Löschen
            </button>
          </div>
        </div>

        <p v-else class="keine-vm">Für dieses Modul gibt es noch keine VM.</p>
      </template>
    </div>

    <p v-if="displayModules.length === 0" class="keine-vm">
      Du bist noch in keinem Modul eingetragen.
    </p>
  </main>
</template>

<style scoped>
.dashboard {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
  color: #2d3748;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1a202c;
}

.modul-box-large {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.modul-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.modul-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.badge-outline {
  border: 2px solid #2d3748;
  border-radius: 6px;
  padding: 0.2rem 1rem;
  font-weight: 600;
  font-size: 1.1rem;
}

.modul-description {
  font-size: 1rem;
  font-weight: 600;
  color: #2b6cb0;
}

.chevron {
  transition: transform 0.2s ease;
  color: #4a5568;
}

.chevron.open {
  transform: rotate(180deg);
}

.vm-card {
  margin-top: 1.25rem;
  padding: 1.25rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem;
  background-color: #f7fafc;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.vm-card:hover {
  background-color: #edf2f7;
}

.vm-info {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.vm-name {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
  font-size: 1.1rem;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.status-dot.active {
  background-color: #38a169;
}

.status-dot.inactive {
  background-color: #e53e3e;
}

.ip-address {
  font-family: monospace;
  font-size: 1rem;
}

.uptime {
  font-size: 0.9rem;
  color: #718096;
}

.metrics-row {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.25rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
}

.btn {
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  min-width: 90px;
  text-align: center;
}

.btn-action {
  background-color: #ffffff;
  border: 1px solid #cbd5e0;
  color: #2d3748;
}

.btn-action:hover {
  background-color: #edf2f7;
}

.btn-danger {
  color: #e53e3e;
  border-color: #feb2b2;
}

.btn-danger:hover {
  background-color: #fff5f5;
  border-color: #e53e3e;
}

.keine-vm {
  margin: 1.25rem 0 0;
  color: #718096;
}
</style>
