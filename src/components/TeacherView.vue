<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { vms } from "../mockData";
import { laufendeVms } from "../vmValues";

const router = useRouter();
const currentTeacherID = ref(1);
const activeModul = ref<any>(null);

const dbData = ref({
  User: [
    {
      userId: 1,
      name: "Marc",
      surname: "Keller",
      email: "m.keller@schule.ch",
      role: "lehrer",
    },
    {
      userId: 101,
      name: "Lukas",
      surname: "Weber",
      email: "l.weber@stud.schule.ch",
      role: "schueler",
      enabled: true,
      klassenId: 1,
    },
    {
      userId: 102,
      name: "Anna",
      surname: "Fischer",
      email: "a.fischer@stud.schule.ch",
      role: "schueler",
      enabled: true,
      klassenId: 1,
    },
  ],
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
  ],
  class: [{ classID: 1, name: "D24a" }],
  ClassModule: [{ moduleID: 1, classID: 1 }],
  UserModul: [
    { moduleID: 1, userId: 1 },
    { moduleID: 2, userId: 1 },
  ],
});
onMounted(() => {
  const payload = history.state?.importedPayload as
      | Array<{
    klasseName: string;
    students: Array<{ name: string; surname: string; email: string }>;
  }>
      | undefined;

  if (payload && Array.isArray(payload)) {
    payload.forEach((klasseData) => {
      let existingClass = dbData.value.class.find(
          (c) => c.name.toLowerCase() === klasseData.klasseName.toLowerCase(),
      );

      if (!existingClass) {
        existingClass = {
          classID: Date.now() + Math.random(),
          name: klasseData.klasseName,
        };
        dbData.value.class.push(existingClass);
      }

      klasseData.students.forEach((s, index) => {
        const userExists = dbData.value.User.some((u) => u.email === s.email);

        if (!userExists) {
          dbData.value.User.push({
            userId: Date.now() + index + Math.random(),
            name: s.name,
            surname: s.surname,
            email: s.email,
            role: "schueler",
            enabled: true,
            klassenId: existingClass!.classID,
          });
        }
      });
    });

    window.history.replaceState({}, document.title);
  }
});
const displayModules = computed(() => {
  const teacherModuleIDs = dbData.value.UserModul.filter(
      (um) => um.userId === currentTeacherID.value,
  ).map((um) => um.moduleID);

  return dbData.value.modules
      .filter((m) => teacherModuleIDs.includes(m.moduleID))
      .map((m) => {
        const assignedClassIDs = dbData.value.ClassModule.filter(
            (cm) => cm.moduleID === m.moduleID,
        ).map((cm) => cm.classID);

        const klassen = dbData.value.class
            .filter((c) => assignedClassIDs.includes(c.classID))
            .map((c) => {
              const modulVms = vms.filter((v) => v.moduleID === m.moduleID);
              const laufend = laufendeVms(modulVms);

              return {
                classID: c.classID,
                title: c.name,
                status: `${laufend} von ${modulVms.length} VMs laufen`,
                active: laufend > 0,
              };
            });

        return {
          moduleID: m.moduleID,
          name: m.abbreviation,
          description: m.description,
          klassen,
        };
      });
});

const modulDialog = ref<HTMLDialogElement | null>(null);
const klassenDialog = ref<HTMLDialogElement | null>(null);
const newModulName = ref("");
const selectedClassIDs = ref<number[]>([]);

function openModal() {
  newModulName.value = "";
  modulDialog.value?.showModal();
}

function closeModal() {
  modulDialog.value?.close();
}

function addModul() {
  if (newModulName.value.trim() !== "") {
    const newModuleID = Date.now();
    dbData.value.modules.push({
      moduleID: newModuleID,
      abbreviation: newModulName.value.trim(),
      description: "Neues Modul",
    });
    dbData.value.UserModul.push({
      moduleID: newModuleID,
      userId: currentTeacherID.value,
    });
    closeModal();
  }
}

function openClassSelectModal(modul: any) {
  activeModul.value = modul;
  selectedClassIDs.value = dbData.value.ClassModule.filter(
      (cm) => cm.moduleID === modul.moduleID,
  ).map((cm) => cm.classID);

  klassenDialog.value?.showModal();
}

function closeClassSelectModal() {
  klassenDialog.value?.close();
}

function saveClassSelection() {
  if (!activeModul.value) return;

  const currentModuleID = activeModul.value.moduleID;

  dbData.value.ClassModule = dbData.value.ClassModule.filter(
      (cm) => cm.moduleID !== currentModuleID,
  );

  selectedClassIDs.value.forEach((classID) => {
    dbData.value.ClassModule.push({
      moduleID: currentModuleID,
      classID: classID,
    });
  });

  closeClassSelectModal();
}

function goToCsvImport() {
  router.push("/csv");
}
</script>

<template>
  <main class="page">
    <div class="top">
      <h1>
        Hallo {{ dbData.User.find((u) => u.userId === currentTeacherID)?.name }}
      </h1>
      <button @click="goToCsvImport" class="btn">CSV importieren</button>
    </div>

    <section
        v-for="modul in displayModules"
        :key="modul.moduleID"
        class="modul"
    >
      <div class="modul-head">
        <span class="modul-code">{{ modul.name }}</span>
        <span class="modul-text">{{ modul.description }}</span>
        <button
            @click="openClassSelectModal(modul)"
            class="btn btn-blau modul-button"
        >
          Klassen zuordnen
        </button>
      </div>

      <div class="modul-body">
        <router-link
            v-for="klasse in modul.klassen"
            :key="klasse.classID"
            :to="`/class/${modul.name}/${klasse.title}`"
            class="klasse"
        >
          <div>
            <div class="klasse-name">{{ klasse.title }}</div>
            <div class="klasse-status" :class="{ aktiv: klasse.active }">
              {{ klasse.status }}
            </div>
          </div>
          <svg
              class="pfeil"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </router-link>

        <p v-if="modul.klassen.length === 0" class="leer">
          Diesem Modul ist noch keine Klasse zugeordnet.
        </p>
      </div>
    </section>

    <button @click="openModal" class="neues-modul">
      + Neues Modul erstellen
    </button>

    <dialog ref="klassenDialog" class="dialog">
      <h3>Klassen für {{ activeModul?.name }} auswählen</h3>

      <label v-for="c in dbData.class" :key="c.classID" class="checkbox">
        <input type="checkbox" :value="c.classID" v-model="selectedClassIDs" />
        Klasse {{ c.name }}
      </label>

      <div class="dialog-buttons">
        <button @click="closeClassSelectModal" class="btn">Abbrechen</button>
        <button @click="saveClassSelection" class="btn btn-blau">
          Speichern
        </button>
      </div>
    </dialog>

    <dialog ref="modulDialog" class="dialog">
      <h3>Neues Modul erstellen</h3>
      <input
          v-model="newModulName"
          type="text"
          placeholder="M123..."
          @keyup.enter="addModul"
      />
      <div class="dialog-buttons">
        <button @click="closeModal" class="btn">Abbrechen</button>
        <button @click="addModul" class="btn btn-blau">Erstellen</button>
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
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
}

h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 600;
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
  color: var(--on-primary);
  background-color: var(--primary);
}

.btn-blau {
  color: var(--on-primary);
  background-color: var(--primary);
  border-color: var(--primary);
}

.btn-blau:hover {
  background-color: var(--primary-hover);
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

.modul-button {
  margin-left: auto;
}

.modul-body {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px;
  border-top: 1px solid var(--border);
}

.klasse {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  color: inherit;
  text-decoration: none;
  border: 1px solid var(--border);
  border-radius: 6px;
}

.klasse:hover {
  border-color: var(--primary);
}

.klasse:hover .pfeil {
  color: var(--primary);
}

.klasse-name {
  font-weight: 600;
}

.klasse-status {
  margin-top: 2px;
  font-size: 13px;
  color: var(--text-muted);
}

.klasse-status.aktiv {
  color: var(--success);
}

.pfeil {
  color: var(--text-muted);
}

.leer {
  grid-column: 1 / -1;
  margin: 0;
  color: var(--text-muted);
}

.neues-modul {
  width: 100%;
  padding: 12px;
  font-family: inherit;
  font-size: 14px;
  color: var(--text-muted);
  background: none;
  border: 1px dashed var(--border-strong);
  border-radius: 8px;
  cursor: pointer;
}

.neues-modul:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.dialog {
  width: 100%;
  max-width: 360px;
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
  margin: 0 0 16px;
  font-size: 18px;
}

.dialog input[type="text"] {
  width: 100%;
  height: 34px;
  padding: 0 10px;
  font-family: inherit;
  font-size: 14px;
  color: var(--text);
  background-color: var(--surface-2);
  border: 1px solid var(--border-strong);
  border-radius: 6px;
  box-sizing: border-box;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  cursor: pointer;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

@media (max-width: 600px) {
  .modul-text {
    display: none;
  }

  .modul-body {
    grid-template-columns: 1fr;
  }


}
</style>