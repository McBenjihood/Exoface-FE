<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { vms } from "../mockData";
import { laufendeVms } from "../vmValues";
import { instanceTypes, templates, ramText, diskText } from "../instanceTypes";
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

const erstellenDialog = ref<HTMLDialogElement | null>(null);
const gewaehlterTyp = ref("Small");
const gewaehltesTemplate = ref("Ubuntu 24.04 LTS");
const diskGroesse = ref(20);
const anzahl = ref<Record<number, number>>({});

const typ = computed(() =>
    instanceTypes.find((t) => t.name === gewaehlterTyp.value),
);

const totalNeu = computed(() =>
    classStudents.value.reduce(
        (summe, s) => summe + (anzahl.value[s.studentID] ?? 0),
        0,
    ),
);

const diskOk = computed(
    () =>
        !!typ.value &&
        diskGroesse.value >= typ.value.diskMin &&
        diskGroesse.value <= typ.value.diskMax,
);

function openErstellen() {
  classStudents.value.forEach((s) => {
    anzahl.value[s.studentID] = 1;
  });
  erstellenDialog.value?.showModal();
}
function openFuerSchueler(studentID: number) {
  classStudents.value.forEach((s) => {
    anzahl.value[s.studentID] = s.studentID === studentID ? 1 : 0;
  });
  erstellenDialog.value?.showModal();
}

function closeErstellen() {
  erstellenDialog.value?.close();
}

function freierName(basis: string) {
  let name = basis;
  let nummer = 2;
  while (vms.some((v) => v.name === name)) {
    name = basis + "-" + nummer;
    nummer++;
  }
  return name;
}

function vmsErstellen() {
  if (!currentModul.value || !typ.value || !diskOk.value) return;

  classStudents.value.forEach((student) => {
    const nachname = (student.name.split(" ").pop() ?? "").toLowerCase();
    const basis = `${props.modulName}-${props.klassenTitle}-${nachname}`.toLowerCase();

    for (let i = 0; i < (anzahl.value[student.studentID] ?? 0); i++) {
      const neueID = Math.max(0, ...vms.map((v) => v.vmID)) + 1;

      vms.push({
        vmID: neueID,
        name: freierName(basis),
        studentID: student.studentID,
        studentName: student.name,
        moduleID: currentModul.value!.moduleID,
        ip: `178.162.00.${neueID}:2000`,
        uptime: "-",
        cpu: "0 / 100%",
        ram: `0 GB / ${ramText(typ.value!.ram)}`,
        storage: `0 GB / ${diskGroesse.value} GB`,
        status: "inactive",
        template: gewaehltesTemplate.value,
      });
    }
  });

  closeErstellen();
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
      <button class="btn btn-blau" @click="openErstellen">VMs erstellen</button>
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
        <button
            class="btn btn-blau btn-klein"
            @click.prevent="openFuerSchueler(student.studentID)"
        >
          VM erstellen
        </button>
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

    <dialog ref="erstellenDialog" class="dialog">
      <h3>VMs erstellen</h3>

      <h4>Grösse</h4>
      <div class="typen">
        <label
            v-for="t in instanceTypes"
            :key="t.name"
            class="typ"
            :class="{ gewaehlt: gewaehlterTyp === t.name }"
        >
          <input v-model="gewaehlterTyp" type="radio" :value="t.name" />
          <span class="typ-name">{{ t.name }}</span>
          <span class="typ-wert">{{ ramText(t.ram) }} RAM</span>
          <span class="typ-wert">{{ t.cpu }} {{ t.cpu === 1 ? "Core" : "Cores" }}</span>
          <span class="typ-wert">bis {{ diskText(t.diskMax) }}</span>
          <span class="typ-preis">{{ t.preis.toFixed(5) }} / Std.</span>
        </label>
      </div>

      <h4>Template und Disk</h4>
      <div class="felder">
        <label class="feld">
          Template
          <select v-model="gewaehltesTemplate">
            <option v-for="t in templates" :key="t" :value="t">{{ t }}</option>
          </select>
        </label>
        <label class="feld">
          Disk in GB
          <input
              v-model.number="diskGroesse"
              type="number"
              :min="typ?.diskMin"
              :max="typ?.diskMax"
          />
        </label>
      </div>
      <p v-if="!diskOk" class="fehler">
        Die Disk muss zwischen {{ typ?.diskMin }} und {{ typ?.diskMax }} GB sein.
      </p>

      <h4>Lernende</h4>
      <div class="lernende">
        <div
            v-for="student in classStudents"
            :key="student.studentID"
            class="lernende-zeile"
        >
          <span class="lernende-name">{{ student.name }}</span>
          <input
              v-model.number="anzahl[student.studentID]"
              type="number"
              min="0"
              max="5"
          />
        </div>
      </div>

      <p class="dialog-text">
        <template v-if="totalNeu === 0">Keine VMs ausgewählt.</template>
        <template v-else>
          Es werden {{ totalNeu }} VMs erstellt · ca.
          {{ ((typ?.preis ?? 0) * totalNeu).toFixed(2) }} pro Stunde
        </template>
      </p>

      <div class="dialog-buttons">
        <button class="btn" @click="closeErstellen">Abbrechen</button>
        <button
            class="btn btn-blau"
            :disabled="totalNeu === 0 || !diskOk"
            @click="vmsErstellen"
        >
          Erstellen
        </button>
      </div>
    </dialog>
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

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.btn-klein {
  height: 28px;
  padding: 0 10px;
  font-size: 13px;
}

.dialog {
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  padding: 20px;
  color: var(--text);
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-sizing: border-box;
}

.dialog::backdrop {
  background-color: var(--overlay);
}

.dialog h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.dialog h4 {
  margin: 16px 0 8px;
  font-size: 14px;
  font-weight: 600;
}

.dialog-text {
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--text-muted);
}

.typen {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 220px;
  overflow-y: auto;
}

.typ {
  display: grid;
  grid-template-columns: auto 1fr 100px 70px 90px 100px;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
}

.typ:hover {
  border-color: var(--primary);
}

.typ.gewaehlt {
  border-color: var(--primary);
  background-color: var(--primary-soft);
}

.typ-name {
  font-weight: 600;
  white-space: nowrap;
}

.typ-wert {
  color: var(--text-muted);
}

.typ-preis {
  font-size: 12px;
  text-align: right;
  color: var(--text-muted);
}

.felder {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 8px;
}

.feld {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: var(--text-muted);
}

.feld select,
.feld input,
.lernende-zeile input {
  height: 32px;
  padding: 0 8px;
  font-family: inherit;
  font-size: 14px;
  color: var(--text);
  background-color: var(--surface-2);
  border: 1px solid var(--border-strong);
  border-radius: 6px;
}

.feld input {
  width: 90px;
}

.lernende {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.lernende-zeile {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.lernende-name {
  flex: 1;
}



.lernende-zeile input {
  width: 64px;
}

.fehler {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--danger);
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

@media (max-width: 600px) {
  .top {
    flex-wrap: wrap;
  }

  .typ {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
  }

  .typ-name {
    flex: 1 0 70%;
  }

  .typ-wert {
    font-size: 13px;
  }

  .typ-preis {
    display: none;
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