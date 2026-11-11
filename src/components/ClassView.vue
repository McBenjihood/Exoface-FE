<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { vms } from "../mockData";
import { laufendeVms } from "../vmValues";
import VmCard from "./VmCard.vue";

const props = defineProps<{
  modulName: string;
  klassenTitle: string;
}>();

const router = useRouter();

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
  Students: [
    { studentID: 1, name: "Schüler 1", classID: 1 },
    { studentID: 2, name: "Schüler 2", classID: 1 },
    { studentID: 3, name: "Schüler 3", classID: 1 },
    { studentID: 4, name: "Max Muster", classID: 1 },
    { studentID: 104, name: "Jan Huppertz", classID: 1 },
  ],
});

const currentModul = computed(() =>
    dbData.value.modules.find((m) => m.abbreviation === props.modulName),
);

const currentClass = computed(() =>
    dbData.value.class.find((c) => c.name === props.klassenTitle),
);

const classStudents = computed(() =>
    dbData.value.Students.filter(
        (s) => s.classID === currentClass.value?.classID,
    ),
);

function getVms(studentID: number) {
  return vms.filter(
      (v) =>
          v.studentID === studentID && v.moduleID === currentModul.value?.moduleID,
  );
}

const klassenVms = computed(() =>
    classStudents.value.flatMap((s) => getVms(s.studentID)),
);

function alleStarten() {
  klassenVms.value.forEach((vm) => (vm.status = "active"));
}

function alleStoppen() {
  klassenVms.value.forEach((vm) => (vm.status = "inactive"));
}

function vmsErstellen() {
  if (!currentModul.value) return;

  classStudents.value.forEach((student) => {
    if (getVms(student.studentID).length > 0) return;

    const neueID = Math.max(0, ...vms.map((v) => v.vmID)) + 1;
    const nachname = (student.name.split(" ").pop() ?? "").toLowerCase();

    vms.push({
      vmID: neueID,
      name: `${props.modulName}-${props.klassenTitle}-${nachname}`.toLowerCase(),
      studentID: student.studentID,
      studentName: student.name,
      moduleID: currentModul.value!.moduleID,
      ip: `178.162.00.${neueID}:2000`,
      uptime: "-",
      cpu: "0 / 100%",
      ram: "0 GB / 16 GB",
      storage: "0 GB / 100 GB",
      status: "inactive",
    });
  });
}

function backtolast() {
  router.push("/overview");
}
</script>

<template>
  <main class="page">
    <div class="top">
      <button class="back" @click="backtolast" title="Zurück">
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
      <span class="klasse-code">{{ klassenTitle }}</span>
      <span class="modul-text">
        {{ modulName
        }}<template v-if="currentModul">
          - {{ currentModul.description }}</template
      >
      </span>
    </div>

    <p class="untertitel">
      {{ classStudents.length }} Lernende ·
      {{ laufendeVms(klassenVms) }} von {{ klassenVms.length }} VMs laufen
    </p>

    <div class="aktionen">
      <button class="btn btn-blau" @click="vmsErstellen">VMs erstellen</button>
      <button class="btn" @click="alleStarten">Alle starten</button>
      <button class="btn" @click="alleStoppen">Alle stoppen</button>
    </div>

    <details
        v-for="student in classStudents"
        :key="student.studentID"
        class="schueler"
    >
      <summary class="schueler-head">
        <span class="schueler-name">{{ student.name }}</span>
        <span class="zaehler">
          <template v-if="getVms(student.studentID).length === 0">
            keine VM
          </template>
          <template v-else>
            {{ laufendeVms(getVms(student.studentID)) }} von
            {{ getVms(student.studentID).length }} laufen
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

      <div class="schueler-body">
        <VmCard
            v-for="vm in getVms(student.studentID)"
            :key="vm.vmID"
            :vm="vm"
            loeschbar
        />

        <p v-if="getVms(student.studentID).length === 0" class="leer">
          Dieser Schüler hat in diesem Modul noch keine VM.
        </p>
      </div>
    </details>

    <p v-if="classStudents.length === 0" class="leer">
      In dieser Klasse sind noch keine Schüler.
    </p>
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
  gap: 12px;
}

.back {
  display: flex;
  padding: 4px;
  color: var(--text);
  background: none;
  border: none;
  cursor: pointer;
}

.back:hover {
  color: var(--primary);
}

.klasse-code {
  padding: 3px 10px;
  font-weight: 600;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
}

.modul-text {
  color: var(--text-muted);
}

.untertitel {
  margin: 12px 0 16px;
  color: var(--text-muted);
}

.aktionen {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.btn {
  height: 32px;
  padding: 0 14px;
  font-family: inherit;
  font-size: 14px;
  color: var(--text);
  background-color: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: 6px;
  cursor: pointer;
}

.btn:hover {
  background-color: var(--surface-2);
}

.btn-blau {
  color: var(--on-primary);
  background-color: var(--primary);
  border-color: var(--primary);
}

.btn-blau:hover {
  background-color: var(--primary-hover);
}

.schueler {
  margin-bottom: 12px;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.schueler-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  user-select: none;
  list-style: none;
}

.schueler-head::-webkit-details-marker {
  display: none;
}

.schueler-name {
  font-weight: 600;
}

.zaehler {
  margin-left: auto;
  font-size: 13px;
  color: var(--text-muted);
}

.pfeil {
  color: var(--text-muted);
}

.schueler[open] .pfeil {
  transform: rotate(180deg);
}

.schueler-body {
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
  .top {
    flex-wrap: wrap;
  }
}

.schueler[open] .schueler-body {
  animation: aufklappen 0.25s ease-out;
}

@keyframes aufklappen {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .schueler[open] .schueler-body {
    animation: none;
  }
}

.schueler {
  interpolate-size: allow-keywords;
}

.schueler::details-content {
  block-size: 0;
  overflow: hidden;
  transition:
      block-size 0.3s ease,
      content-visibility 0.3s allow-discrete;
}

.schueler[open]::details-content {
  block-size: auto;
}

@media (prefers-reduced-motion: reduce) {
  .schueler::details-content {
    transition: none;
  }
}
</style>