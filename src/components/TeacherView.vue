<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

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
          const classStudents = dbData.value.User.filter(
            (u) => u.role === "schueler" && u.klassenId === c.classID,
          );
          const activeCount = classStudents.filter((u) => u.enabled).length;

          return {
            classID: c.classID,
            title: c.name,
            status: `${activeCount} / ${classStudents.length} aktiv`,
            active: activeCount > 0,
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

const showModal = ref(false);
const showClassSelectModal = ref(false);
const newModulName = ref("");
const selectedClassIDs = ref<number[]>([]);

function openModal() {
  newModulName.value = "";
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
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

  showClassSelectModal.value = true;
}

function closeClassSelectModal() {
  showClassSelectModal.value = false;
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

function pushtoclassview(modulName: string, klasseTitle: string) {
  router.push(`/class/${modulName}/${klasseTitle}`);
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
        <div
          v-for="klasse in modul.klassen"
          :key="klasse.classID"
          class="klasse"
          @click="pushtoclassview(modul.name, klasse.title)"
        >
          <span class="klasse-name">{{ klasse.title }}</span>
          <span class="klasse-status" :class="{ aktiv: klasse.active }">
            {{ klasse.status }}
          </span>
        </div>

        <p v-if="modul.klassen.length === 0" class="leer">
          Diesem Modul ist noch keine Klasse zugeordnet.
        </p>
      </div>
    </section>

    <button @click="openModal" class="neues-modul">
      + Neues Modul erstellen
    </button>

    <div
      v-if="showClassSelectModal"
      class="modal-overlay"
      @click.self="closeClassSelectModal"
    >
      <div class="modal">
        <h3>Klassen für {{ activeModul?.name }} auswählen</h3>

        <label v-for="c in dbData.class" :key="c.classID" class="checkbox">
          <input
            type="checkbox"
            :value="c.classID"
            v-model="selectedClassIDs"
          />
          Klasse {{ c.name }}
        </label>

        <div class="modal-buttons">
          <button @click="closeClassSelectModal" class="btn">Abbrechen</button>
          <button @click="saveClassSelection" class="btn btn-blau">
            Speichern
          </button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>Neues Modul erstellen</h3>
        <input
          v-model="newModulName"
          type="text"
          placeholder="M123..."
          @keyup.enter="addModul"
          autofocus
        />
        <div class="modal-buttons">
          <button @click="closeModal" class="btn">Abbrechen</button>
          <button @click="addModul" class="btn btn-blau">Erstellen</button>
        </div>
      </div>
    </div>
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
  color: #12242e;
  background-color: #ffffff;
  border: 1px solid #b8c4cc;
  border-radius: 6px;
  cursor: pointer;
}

.btn:hover {
  background-color: #0369a1;
}

.btn-blau {
  color: #ffffff;
  background-color: #0369a1;
  border-color: #0369a1;
}

.btn-blau:hover {
  background-color: #075985;
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

.modul-button {
  margin-left: auto;
}

.modul-body {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #dde5ea;
}

.klasse {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid #dde5ea;
  border-radius: 6px;
  cursor: pointer;
}

.klasse:hover {
  border-color: #0369a1;
}

.klasse-name {
  font-weight: 600;
}

.klasse-status {
  font-size: 13px;
  color: #5a6b77;
}

.klasse-status.aktiv {
  color: #16a34a;
}

.leer {
  grid-column: 1 / -1;
  margin: 0;
  color: #5a6b77;
}

.neues-modul {
  width: 100%;
  padding: 12px;
  font-family: inherit;
  font-size: 14px;
  color: #5a6b77;
  background: none;
  border: 1px dashed #b8c4cc;
  border-radius: 8px;
  cursor: pointer;
}

.neues-modul:hover {
  color: #0369a1;
  border-color: #0369a1;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(18, 36, 46, 0.4);
}

.modal {
  width: 100%;
  max-width: 360px;
  margin: 0 16px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
}

.modal h3 {
  margin: 0 0 16px;
  font-size: 18px;
}

.modal input[type="text"] {
  width: 100%;
  height: 34px;
  margin-bottom: 16px;
  padding: 0 10px;
  font-family: inherit;
  font-size: 14px;
  border: 1px solid #b8c4cc;
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

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

@media (max-width: 600px) {
  .modul-text {
    display: none;
  }
}
</style>
