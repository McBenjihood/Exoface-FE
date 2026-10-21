<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { vms, type Vm } from "../mockData";

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

const openStudents = ref<number[]>([]);

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

function toggleStudent(studentID: number) {
  if (openStudents.value.includes(studentID)) {
    openStudents.value = openStudents.value.filter((id) => id !== studentID);
  } else {
    openStudents.value.push(studentID);
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

function backtolast() {
  router.push("/overview");
}

function uploadcsv() {
  router.push("/csv");
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
    <div class="top">
      <button class="back" @click="backtolast">
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
      <button class="csv-button" @click="uploadcsv">CSV importieren</button>
    </div>

    <section
      v-for="student in classStudents"
      :key="student.studentID"
      class="schueler"
    >
      <div class="schueler-head" @click="toggleStudent(student.studentID)">
        <span class="schueler-name">{{ student.name }}</span>
        <span
          class="pfeil"
          :class="{ offen: openStudents.includes(student.studentID) }"
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

      <div
        v-if="openStudents.includes(student.studentID)"
        class="schueler-body"
      >
        <div
          v-for="vm in getVms(student.studentID)"
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
            <button class="loeschen" @click="deleteVM(vm.vmID)">Löschen</button>
          </div>
        </div>

        <p v-if="getVms(student.studentID).length === 0" class="leer">
          Dieser Schüler hat in diesem Modul noch keine VM.
        </p>
      </div>
    </section>

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
  margin-bottom: 24px;
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

.klasse-code {
  padding: 3px 10px;
  font-weight: 600;
  background-color: #ffffff;
  border: 1px solid #dde5ea;
  border-radius: 6px;
}

.modul-text {
  color: #5a6b77;
}

.csv-button {
  height: 32px;
  margin-left: auto;
  padding: 0 14px;
  font-family: inherit;
  font-size: 14px;
  color: #12242e;
  background-color: #ffffff;
  border: 1px solid #b8c4cc;
  border-radius: 6px;
  cursor: pointer;
}

.csv-button:hover {
  background-color: #f4f7f9;
}

.schueler {
  margin-bottom: 12px;
  background-color: #ffffff;
  border: 1px solid #dde5ea;
  border-radius: 8px;
}

.schueler-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  user-select: none;
}

.schueler-name {
  font-weight: 600;
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

.schueler-body {
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

.vm-buttons .loeschen {
  color: #dc2626;
}

.vm-buttons .loeschen:hover {
  border-color: #dc2626;
}

.leer {
  margin: 0;
  color: #5a6b77;
}

@media (max-width: 600px) {
  .top {
    flex-wrap: wrap;
  }

  .vm {
    flex-direction: column;
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
