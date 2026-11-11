<script setup lang="ts">
import { ref, computed } from "vue";
import { getUser } from "../auth";
import { vms } from "../mockData";
import { laufendeVms } from "../vmValues";
import VmCard from "./VmCard.vue";

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

const meineVms = computed(() =>
    vms.filter((v) => v.studentID === currentStudent.value?.studentID),
);
</script>

<template>
  <main class="page">
    <h1>Hallo {{ user?.name }}</h1>
    <p class="untertitel">
      {{ laufendeVms(meineVms) }} von {{ meineVms.length }} VMs laufen gerade.
    </p>

    <details
        v-for="(modul, index) in displayModules"
        :key="modul.moduleID"
        class="modul"
        :open="index === 0"
    >
      <summary class="modul-head">
        <span class="modul-code">{{ modul.name }}</span>
        <span class="modul-text">{{ modul.description }}</span>
        <span class="zaehler">
          <template v-if="modul.moduleVms.length === 0">keine VM</template>
          <template v-else>
            {{ laufendeVms(modul.moduleVms) }} von
            {{ modul.moduleVms.length }} laufen
          </template>
        </span>
        <svg
            class="pfeil"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>

      <div class="modul-body">
        <VmCard v-for="vm in modul.moduleVms" :key="vm.vmID" :vm="vm" />

        <p v-if="modul.moduleVms.length === 0" class="leer">
          Die Lehrperson hat für dieses Modul noch keine VM erstellt.
        </p>
      </div>
    </details>

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
  margin: 0;
  font-size: 26px;
  font-weight: 600;
}

.untertitel {
  margin: 6px 0 24px;
  color: var(--text-muted);
}

.modul {
  margin-bottom: 12px;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.modul-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  user-select: none;
  list-style: none;
}

.modul-head::-webkit-details-marker {
  display: none;
}

.modul-code {
  padding: 3px 10px;
  font-weight: 600;
  background-color: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 6px;
}

.modul-text {
  color: var(--text-muted);
}

.zaehler {
  margin-left: auto;
  font-size: 13px;
  color: var(--text-muted);
}

.pfeil {
  color: var(--text-muted);
}

.modul[open] .pfeil {
  transform: rotate(180deg);
}

.modul-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid var(--border);
}

.leer {
  margin: 0;
  color: var(--text-muted);
}

@media (max-width: 600px) {
  .modul-text {
    display: none;
  }
}

.modul {
  interpolate-size: allow-keywords;
}

.modul::details-content {
  block-size: 0;
  overflow: hidden;
  transition:
      block-size 0.3s ease,
      content-visibility 0.3s allow-discrete;
}

.modul[open]::details-content {
  block-size: auto;
}

@media (prefers-reduced-motion: reduce) {
  .modul::details-content {
    transition: none;
  }
}
</style>
