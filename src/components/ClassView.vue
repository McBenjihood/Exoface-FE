<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  getInstanceTypes, getTemplates, createVm, getStudents, getVmList,
  bytesZuGb, typLabel,
  type ApiInstanceType, type ApiTemplate, type ApiVm,
} from "../api";

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
    { studentID: 1, userId: 1, name: "Jan Huppertz", classID: 1 },
    { studentID: 2, userId: 3, name: "Benjoman Blümchen", classID: 1 },
    { studentID: 3, userId: 2, name: "Murat Hamahmi", classID: 1 },
  ],
});

const currentModul = computed(() =>
    dbData.value.modules.find((m) => m.abbreviation === props.modulName),
);

const classStudents = ref<{
  studentID: number;
  userId: number | null;
  name: string;
  registriert: boolean;
}[]>([]);

function getVms(studentID: number) {
  const student = classStudents.value.find((s) => s.studentID === studentID);
  if (!student || student.userId === null) return [];
  return serverVms.value.filter((v) => v.userId === student.userId);
}

const klassenVms = computed(() =>
    classStudents.value.flatMap((s) => getVms(s.studentID)),
);

const erstellenDialog = ref<HTMLDialogElement | null>(null);
const diskGroesse = ref(20);
const anzahl = ref<Record<number, number>>({});

const apiTypes = ref<ApiInstanceType[]>([]);
const apiTemplates = ref<ApiTemplate[]>([]);
const ladefehler = ref("");
const laedt = ref(false);

const gewaehlterTypId = ref("");
const gewaehltesTemplateId = ref("");

const nurFuer = ref<number | null>(null);
const erstellt = ref(false);
const fehler = ref("");

const serverVms = ref<ApiVm[]>([]);

onMounted(async () => {
  laedt.value = true;

  try {
    const lernende = await getStudents(props.klassenTitle);
    classStudents.value = lernende.map((s, i) => ({
      studentID: i + 1,
      userId: s.userId,
      name: `${s.name} ${s.surname}`.trim(),
      registriert: s.registriert,
    }));
    serverVms.value = await getVmList();
  } catch (e) {
    ladefehler.value = (e as Error).message;
  }

  try {
    const [typen, vorlagen] = await Promise.all([getInstanceTypes(), getTemplates()]);
    apiTypes.value = typen;
    apiTemplates.value = vorlagen;
    gewaehlterTypId.value = typen[0]?.id ?? "";
    gewaehltesTemplateId.value = vorlagen[0]?.id ?? "";
  } catch (e) {
    ladefehler.value = (e as Error).message;
  } finally {
    laedt.value = false;
  }
});
const zielSchueler = computed(() =>
    nurFuer.value === null
        ? classStudents.value
        : classStudents.value.filter((s) => s.studentID === nurFuer.value),
);

const MAX_PRO_PERSON = 5;

function anzahlVon(studentID: number) {
  return Number(anzahl.value[studentID]) || 0;
}

function begrenze(wert: unknown) {
  const zahl = Math.floor(Number(wert));
  return Number.isFinite(zahl) ? Math.min(MAX_PRO_PERSON, Math.max(0, zahl)) : 0;
}

function aendereAnzahl(studentID: number, schritt: number) {
  anzahl.value[studentID] = begrenze(anzahlVon(studentID) + schritt);
}

function eingabeAnzahl(studentID: number, e: Event) {
  const feld = e.target as HTMLInputElement;
  const neu = begrenze(feld.value);
  anzahl.value[studentID] = neu;
  feld.value = String(neu);
}

const totalNeu = computed(() =>
    zielSchueler.value.reduce((summe, s) => summe + anzahlVon(s.studentID), 0),
);

const gewaehltesTemplate = computed(() =>
    apiTemplates.value.find((t) => t.id === gewaehltesTemplateId.value),
);

const diskMin = computed(() =>
    Math.max(10, gewaehltesTemplate.value?.size ? bytesZuGb(gewaehltesTemplate.value.size) : 10),
);

const diskMax = 500;

const diskOk = computed(
    () => diskGroesse.value >= diskMin.value && diskGroesse.value <= diskMax,
);

watch(diskMin, () => {
  if (diskGroesse.value < diskMin.value) diskGroesse.value = diskMin.value;
});

function openErstellen() {
  nurFuer.value = null;
  fehler.value = "";
  classStudents.value.forEach((s) => {
    anzahl.value[s.studentID] = 1;
  });
  erstellenDialog.value?.showModal();
}
function openFuerSchueler(studentID: number) {
  nurFuer.value = studentID;
  fehler.value = "";
  anzahl.value = { [studentID]: 1 };
  erstellenDialog.value?.showModal();
}

function closeErstellen() {
  erstellenDialog.value?.close();
}


async function vmsErstellen() {
  if (!gewaehlterTypId.value || !gewaehltesTemplateId.value || !diskOk.value) return;

  fehler.value = "";
  erstellt.value = true;

  try {
    for (const student of zielSchueler.value) {
      if (student.userId === null) continue;
      const wieviele = anzahl.value[student.studentID] ?? 0;
      const nachname = (student.name.split(" ").pop() ?? "").toLowerCase();
      const basis = `${props.modulName}-${props.klassenTitle}-${nachname}`.toLowerCase();

      let nummer = 1;

      for (let i = 0; i < wieviele; i++) {
        let angelegt = false;

        while (!angelegt) {
          const name = nummer === 1 ? basis : `${basis}-${nummer}`;
          try {
            await createVm({
              targetUserId: student.userId,
              name,
              templateId: gewaehltesTemplateId.value,
              instanceTypeId: gewaehlterTypId.value,
              diskSize: diskGroesse.value,
            });
            angelegt = true;
          } catch (e) {
            if (!(e as Error).message.includes("bereits eine VM")) throw e;
            if (nummer > 20) throw e;
          }
          nummer++;
        }
      }
    }
    closeErstellen();
  } catch (e) {
    fehler.value = (e as Error).message;
  } finally {
    erstellt.value = false;
  }
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
      <span class="klasse-code">{{ modulName }} / {{ klassenTitle }}</span>
      <span class="modul-text" v-if="currentModul">
        {{ currentModul.description }}
      </span>
    </div>

    <p class="untertitel">
      {{ classStudents.length }} Lernende
    </p>

    <div class="aktionen">
      <button class="btn btn-blau" @click="openErstellen">VMs erstellen</button>
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
            {{ getVms(student.studentID).length }} VMs
          </template>
        </span>
        <button
            class="btn btn-blau btn-klein"
            :disabled="!student.registriert"
            :title="student.registriert ? '' : 'Hat sich noch nicht registriert'"
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
        <div
            v-for="vm in getVms(student.studentID)"
            :key="vm.uuid"
            class="vm-zeile"
        >
          <span class="vm-zeile-name">{{ vm.name }}</span>
          <span class="vm-zeile-uuid">{{ vm.uuid }}</span>
        </div>

        <p v-if="getVms(student.studentID).length === 0" class="leer">
          Dieser Schüler hat in diesem Modul noch keine VM.
        </p>
      </div>
    </details>

    <p v-if="classStudents.length === 0" class="leer">
      In dieser Klasse sind noch keine Schüler.
    </p>

    <dialog ref="erstellenDialog" class="dialog">
      <h3 v-if="nurFuer === null">VMs erstellen</h3>
      <h3 v-else>VM erstellen für {{ zielSchueler[0]?.name }}</h3>

      <p v-if="ladefehler" class="fehler">{{ ladefehler }}</p>
      <p v-else-if="laedt" class="dialog-text">Lade Grössen und Templates …</p>
      <p v-else-if="apiTypes.length === 0" class="fehler">
        Der Cloud-Provider liefert gerade keine Grössen zurück.
      </p>

      <template v-else>
        <div class="felder">
          <label class="feld feld-breit">
            Grösse
            <select v-model="gewaehlterTypId">
              <option v-for="t in apiTypes" :key="t.id" :value="t.id">
                {{ typLabel(t) }}
              </option>
            </select>
          </label>
          <label class="feld">
            Template
            <select v-model="gewaehltesTemplateId">
              <option v-for="t in apiTemplates" :key="t.id" :value="t.id">
                {{ t.name }}
              </option>
            </select>
          </label>
          <label class="feld">
            Disk in GB
            <input
                v-model.number="diskGroesse"
                type="number"
                :min="diskMin"
                :max="diskMax"
            />
          </label>
        </div>
        <p v-if="!diskOk" class="fehler">
          Die Disk muss zwischen {{ diskMin }} und {{ diskMax }} GB sein.
        </p>

        <template v-if="nurFuer === null">
          <hr class="trenner" />

          <div class="lernende">
            <div
                v-for="student in classStudents"
                :key="student.studentID"
                class="lernende-zeile"
            >
              <span class="lernende-name">{{ student.name }}</span>

              <span class="anzahl-feld">
                <button
                    class="schritt"
                    type="button"
                    :disabled="anzahlVon(student.studentID) === 0"
                    @click="aendereAnzahl(student.studentID, -1)"
                >
                  −
                </button>
                <input
                    type="number"
                    min="0"
                    :max="MAX_PRO_PERSON"
                    :value="anzahlVon(student.studentID)"
                    @input="eingabeAnzahl(student.studentID, $event)"
                />
                <button
                    class="schritt"
                    type="button"
                    :disabled="anzahlVon(student.studentID) >= MAX_PRO_PERSON"
                    @click="aendereAnzahl(student.studentID, 1)"
                >
                  +
                </button>
              </span>
            </div>

            <div class="lernende-total">
              <span>Total</span>
              <span class="total-zahl">{{ totalNeu }}</span>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="einzel">
            <span>Anzahl VMs</span>
            <span class="anzahl-feld">
              <button
                  class="schritt"
                  type="button"
                  :disabled="anzahlVon(nurFuer) === 0"
                  @click="aendereAnzahl(nurFuer, -1)"
              >
                −
              </button>
              <input
                  type="number"
                  min="0"
                  :max="MAX_PRO_PERSON"
                  :value="anzahlVon(nurFuer)"
                  @input="eingabeAnzahl(nurFuer, $event)"
              />
              <button
                  class="schritt"
                  type="button"
                  :disabled="anzahlVon(nurFuer) >= MAX_PRO_PERSON"
                  @click="aendereAnzahl(nurFuer, 1)"
              >
                +
              </button>
            </span>
          </div>
        </template>

        <p v-if="fehler" class="fehler">{{ fehler }}</p>
      </template>

      <div class="dialog-fuss">
        <button class="btn" :disabled="erstellt" @click="closeErstellen">
          Abbrechen
        </button>
        <button
            class="btn btn-blau"
            :disabled="totalNeu === 0 || !diskOk || erstellt || laedt || !!ladefehler || !gewaehlterTypId"
            @click="vmsErstellen"
        >
          {{ erstellt ? "Wird erstellt …" : "Erstellen" }}
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
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
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

.dialog-text {
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--text-muted);
}

.felder {
  display: grid;
  grid-template-columns: 1fr 110px;
  gap: 12px;
}

.feld-breit {
  grid-column: 1 / -1;
}

.trenner {
  margin: 20px 0 0;
  border: 0;
  border-top: 1px solid var(--border);
}

.lernende-total {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 10px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
  font-size: 13px;
  color: var(--text-muted);
}

.total-zahl {
  width: 84px;
  text-align: center;
  font-weight: 600;
  color: var(--text);
}

.feld select,
.feld input {
  height: 32px;
  padding: 0 8px;
  font-family: inherit;
  font-size: 14px;
  color: var(--text);
  background-color: var(--surface-2);
  border: 1px solid var(--border-strong);
  border-radius: 6px;
}

.feld select,
.feld input {
  width: 100%;
}

.lernende {
  margin-top: 14px;
}

.lernende-zeile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 7px 0;
  font-size: 14px;
}

.lernende-zeile + .lernende-zeile {
  border-top: 1px solid var(--border);
}

.lernende-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.anzahl-feld {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.anzahl-feld input {
  width: 32px;
  height: 24px;
  padding: 0;
  font-family: inherit;
  font-size: 14px;
  text-align: center;
  color: var(--text);
  background: none;
  border: 0;
  appearance: textfield;
  -moz-appearance: textfield;
}

.anzahl-feld input::-webkit-outer-spin-button,
.anzahl-feld input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.schritt {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  font-family: inherit;
  font-size: 16px;
  line-height: 1;
  color: var(--text-muted);
  background: none;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
}

.schritt:hover:not(:disabled) {
  color: var(--text);
  background-color: var(--surface-2);
}

.schritt:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.einzel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  font-size: 14px;
}

.fehler {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--danger);
}

.dialog-fuss {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 18px;
}

@media (max-width: 600px) {
  .top {
    flex-wrap: wrap;
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

.vm-zeile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  font-size: 14px;
  background-color: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 4px;
}

.vm-zeile-uuid {
  font-size: 12px;
  color: var(--text-muted);
}
</style>