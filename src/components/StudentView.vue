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
      const moduleVms = vms.filter(
        (v) =>
          v.moduleID === m.moduleID &&
          v.studentID === currentStudent.value?.studentID,
      );

      return {
        moduleID: m.moduleID,
        name: m.abbreviation,
        description: m.description,
        moduleVms,
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
  <main class="page">
    <h1>Hallo {{ user?.name }}</h1>

    <section
      v-for="modul in displayModules"
      :key="modul.moduleID"
      class="modul"
    >
      <div class="modul-head" @click="toggleModul(modul.moduleID)">
        <span class="modul-code">{{ modul.name }}</span>
        <span class="modul-text">{{ modul.description }}</span>
        <span
          class="pfeil"
          :class="{ offen: openModules.includes(modul.moduleID) }"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>

      <div v-if="openModules.includes(modul.moduleID)" class="modul-body">
        <div
          v-for="vm in modul.moduleVms"
          :key="vm.vmID"
          class="vm"
          @click="pushtovmview(vm.vmID)"
        >
          <div class="vm-info">
            <div class="vm-name">
              {{ vm.name }}
              <span class="status" :class="vm.status">
                {{ vm.status === "active" ? "läuft" : "gestoppt" }}
              </span>
            </div>
            <div class="vm-text">{{ vm.ip }}</div>
            <div class="vm-text">Uptime: {{ vm.uptime }}</div>
            <div class="werte">
              <span><span class="wert-name">CPU</span> {{ vm.cpu }}</span>
              <span><span class="wert-name">RAM</span> {{ vm.ram }}</span>
              <span><span class="wert-name">Disk</span> {{ vm.storage }}</span>
            </div>
          </div>

          <div class="vm-buttons" @click.stop>
            <button @click="startStopVM(vm)">
              {{ vm.status === "active" ? "Stoppen" : "Starten" }}
            </button>
            <button @click="resetVM(vm)">Zurücksetzen</button>
          </div>
        </div>

        <p v-if="modul.moduleVms.length === 0" class="leer">
          Die Lehrperson hat für dieses Modul noch keine VM erstellt.
        </p>
      </div>
    </section>

    <p v-if="displayModules.length === 0" class="leer">
      Du bist noch in keinem Modul eingetragen.
    </p>
  </main>
</template>

<style scoped>
.page {
  max-width: 860px;
  margin: 0 auto;
  padding: 32px 20px;
}

h1 {
  margin: 0 0 24px;
  font-size: 26px;
  font-weight: 600;
}

.modul {
  margin-bottom: 12px;
  background-color: #ffffff;
  border: 1px solid #dde5ea;
  border-radius: 8px;
}

.modul-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  user-select: none;
}

.modul-code {
  padding: 3px 10px;
  font-weight: 600;
  background-color: #f4f7f9;
  border: 1px solid #dde5ea;
  border-radius: 6px;
}

.modul-text {
  color: #5a6b77;
}

.pfeil {
  display: flex;
  margin-left: auto;
  color: #5a6b77;
  transition: transform 0.15s;
}

.pfeil.offen {
  transform: rotate(180deg);
}

.modul-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #dde5ea;
}

.vm {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border: 1px solid #dde5ea;
  border-radius: 6px;
  cursor: pointer;
}

.vm:hover {
  border-color: #0369a1;
}

.vm-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vm-name {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2px;
  font-weight: 600;
}

.status {
  font-size: 12px;
  font-weight: normal;
}

.status.active {
  color: #16a34a;
}

.status.inactive {
  color: #dc2626;
}
.vm-text {
  font-size: 14px;
  color: #5a6b77;
}

.werte {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 20px;
  margin-top: 6px;
  font-size: 14px;
}

.wert-name {
  color: #5a6b77;
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
  color: #12242e;
  background-color: #ffffff;
  border: 1px solid #b8c4cc;
  border-radius: 6px;
  cursor: pointer;
}

.vm-buttons button:hover {
  background-color: #f4f7f9;
}

.leer {
  margin: 0;
  color: #5a6b77;
}

@media (max-width: 600px) {
  .vm {
    flex-direction: column;
  }

  .vm-buttons {
    flex-direction: row;
  }

  .modul-text {
    display: none;
  }
}
</style>
