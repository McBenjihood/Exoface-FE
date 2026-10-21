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
  <main class="dashboard">
    <div class="header-top">
      <h1 class="page-title">
        Hallo {{ dbData.User.find((u) => u.userId === currentTeacherID)?.name }}
      </h1>
      <button @click="goToCsvImport" class="btn btn-secondary">
        📁 CSV importieren
      </button>
    </div>

    <div
      v-for="modul in displayModules"
      :key="modul.moduleID"
      class="modul-box-large"
    >
      <div class="modul-header">
        <h2 class="modul-name">{{ modul.name }} - {{ modul.description }}</h2>
        <button @click="openClassSelectModal(modul)" class="btn btn-primary">
          Klassen zuordnen
        </button>
      </div>

      <div class="klassen-container">
        <div
          v-for="klasse in modul.klassen"
          :key="klasse.classID"
          class="klasse-card"
          @click="pushtoclassview(modul.name, klasse.title)"
        >
          <span class="klasse-title">{{ klasse.title }}</span>
          <span class="klasse-status" :class="{ active: klasse.active }">
            {{ klasse.status }}
          </span>
        </div>
      </div>
    </div>

    <!-- Button: Neues Modul erstellen -->
    <button @click="openModal" class="btn btn-secondary neues-modul">
      + Neues Modul erstellen
    </button>

    <!-- Modal: Klassen für Modul auswählen -->
    <div
      v-if="showClassSelectModal"
      class="modal-overlay"
      @click.self="closeClassSelectModal"
    >
      <div class="modal-content">
        <h3>Klassen für {{ activeModul?.name }} auswählen</h3>

        <div class="checkbox-list">
          <label
            v-for="c in dbData.class"
            :key="c.classID"
            class="checkbox-item"
          >
            <input
              type="checkbox"
              :value="c.classID"
              v-model="selectedClassIDs"
            />
            <span>Klasse {{ c.name }}</span>
          </label>
        </div>

        <div class="modal-actions">
          <button @click="closeClassSelectModal" class="btn btn-secondary">
            Abbrechen
          </button>
          <button @click="saveClassSelection" class="btn btn-primary">
            Speichern
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Neues Modul erstellen -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>Neues Modul erstellen</h3>
        <input
          v-model="newModulName"
          type="text"
          placeholder="M123..."
          @keyup.enter="addModul"
          autofocus
        />
        <div class="modal-actions">
          <button @click="closeModal" class="btn btn-secondary">
            Abbrechen
          </button>
          <button @click="addModul" class="btn btn-primary">Erstellen</button>
        </div>
      </div>
    </div>
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

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
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
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #edf2f7;
}

.modul-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #2b6cb0;
}

.klassen-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.klasse-card {
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
  cursor: pointer;
}

.klasse-card:hover {
  transform: translateY(-2px);
  border-color: #cbd5e0;
}

.klasse-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: #2d3748;
}

.klasse-status {
  font-size: 0.875rem;
  color: #718096;
}

.klasse-status.active {
  color: #2f855a;
  font-weight: 500;
}

.btn {
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;
}

.btn:active {
  transform: scale(0.98);
}

.btn-primary {
  background-color: #3182ce;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #2b6cb0;
}

.btn-secondary {
  background-color: #edf2f7;
  color: #2d3748;
  border: 1px solid #cbd5e0;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
}

.neues-modul {
  width: 100%;
  padding: 0.8rem;
  border: 2px dashed #cbd5e0;
  background-color: transparent;
  color: #4a5568;
}

.neues-modul:hover {
  border-color: #3182ce;
  color: #3182ce;
  background-color: #ebf8ff;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.modal-content input[type="text"] {
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  box-sizing: border-box;
}

.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  max-height: 200px;
  overflow-y: auto;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
