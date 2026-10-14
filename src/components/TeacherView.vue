<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const currentTeacherID = ref(1);

const activeModul = ref<any>(null);

const dbData = ref({
  teachers: [
    { teacherID: 1, name: "Marc Keller", email: "m.keller@schule.ch" },
    { teacherID: 2, name: "Sarah Meier", email: "s.meier@schule.ch" }
  ],
  modules: [
    { moduleID: 1, abbreviation: "M111", description: "Netzwerke und Serverinfrastruktur" },
    { moduleID: 2, abbreviation: "M183", description: "Applikationssicherheit implementieren" },
    { moduleID: 3, abbreviation: "M306", description: "IT-Projekte abwickeln" }
  ],
  class: [
    { classID: 1, name: "D24a" },
    { classID: 2, name: "D24b" }
  ],
  ClassModule: [
    { moduleID: 1, classID: 1 },
    { moduleID: 1, classID: 2 },
    { moduleID: 2, classID: 1 },
    { moduleID: 3, classID: 2 }
  ],
  TeacherModule: [
    { teacherModuleID: 1, moduleID: 1, teacherID: 1 },
    { teacherModuleID: 2, moduleID: 2, teacherID: 1 },
    { teacherModuleID: 3, moduleID: 2, teacherID: 2 },
    { teacherModuleID: 4, moduleID: 3, teacherID: 2 }
  ],
  Students: [
    { studentID: 101, name: "Lukas Weber", email: "l.weber@stud.schule.ch", enabled: true, classID: 1 },
    { studentID: 102, name: "Anna Fischer", email: "a.fischer@stud.schule.ch", enabled: true, classID: 1 },
    { studentID: 103, name: "Tim Schneider", email: "t.schneider@stud.schule.ch", enabled: false, classID: 2 }
  ]
});

const displayModules = computed(() => {
  const teacherModuleIDs = dbData.value.TeacherModule
      .filter((tm) => tm.teacherID === currentTeacherID.value)
      .map((tm) => tm.moduleID);


  return dbData.value.modules
      .filter((m) => teacherModuleIDs.includes(m.moduleID))
      .map((m) => {
        const assignedClassIDs = dbData.value.ClassModule
            .filter((cm) => cm.moduleID === m.moduleID)
            .map((cm) => cm.classID);

        const klassen = dbData.value.class
            .filter((c) => assignedClassIDs.includes(c.classID))
            .map((c) => {
              const classStudents = dbData.value.Students.filter((s) => s.classID === c.classID);
              const activeCount = classStudents.filter((s) => s.enabled).length;

              return {
                classID: c.classID,
                title: c.name,
                status: `${activeCount} / ${classStudents.length} aktiv`,
                active: activeCount > 0
              };
            });

        return {
          moduleID: m.moduleID,
          name: m.abbreviation,
          description: m.description,
          klassen
        };
      });
});

const showModal = ref(false);
const showClassModal = ref(false);
const newModulName = ref("");
const newClassName = ref("");

function openModal() {
  newModulName.value = "";
  showModal.value = true;
}

function openClassModal(modul: any) {
  activeModul.value = modul;
  newClassName.value = "";
  showClassModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function closeClassModal() {
  showClassModal.value = false;
}

function addModul() {
  if (newModulName.value.trim() !== "") {
    const newModuleID = Date.now();
    dbData.value.modules.push({
      moduleID: newModuleID,
      abbreviation: newModulName.value.trim(),
      description: "Neues Modul"
    });
    dbData.value.TeacherModule.push({
      teacherModuleID: Date.now(),
      moduleID: newModuleID,
      teacherID: currentTeacherID.value
    });
    closeModal();
  }
}

function addClass() {
  if (newClassName.value.trim() !== "" && activeModul.value) {
    let existingClass = dbData.value.class.find(
        (c) => c.name.toLowerCase() === newClassName.value.trim().toLowerCase()
    );

    if (!existingClass) {
      existingClass = { classID: Date.now(), name: newClassName.value.trim() };
      dbData.value.class.push(existingClass);
    }

    dbData.value.ClassModule.push({
      moduleID: activeModul.value.moduleID,
      classID: existingClass.classID
    });

    closeClassModal();
  }
}

function pushtoclassview(modulName: string, klasseTitle: string) {
  router
      .push({
        name: "teacherclassview",
        params: {
          modulName: modulName,
          klassenTitle: klasseTitle
        }
      })
      .catch((err) => {
        console.error("Router-Fehler:", err);
      });
}
</script>

<template>
  <main class="dashboard">
    <h1 class="page-title">
      Hallo {{ dbData.teachers.find(t => t.teacherID === currentTeacherID)?.name }}
    </h1>

    <div
        v-for="(modul, mIndex) in displayModules"
        :key="mIndex"
        class="modul-box-large"
    >
      <div class="modul-header">
        <h2 class="modul-name">{{ modul.name }} - {{ modul.description }}</h2>
        <button @click="openClassModal(modul)" class="btn btn-primary">
          Klasse hinzufügen
        </button>
      </div>

      <div class="klassen-container">
        <div
            @click="pushtoclassview(modul.name, klasse.title)"
            v-for="(klasse, kIndex) in modul.klassen"
            :key="kIndex"
            class="klasse-card"
        >
          <span class="klasse-title">{{ klasse.title }}</span>
          <span class="klasse-status" :class="{ active: klasse.active }">
            {{ klasse.status }}
          </span>
        </div>
      </div>
    </div>

    <button @click="openModal" class="btn btn-secondary neues-modul">
      + Neues Modul erstellen
    </button>

    <div
        v-if="showClassModal"
        class="modal-overlay"
        @click.self="closeClassModal"
    >
      <div class="modal-content">
        <h3>Neue Klasse hinzufügen</h3>
        <input
            v-model="newClassName"
            type="text"
            placeholder="D24a..."
            @keyup.enter="addClass"
            autofocus
        />
        <div class="modal-actions">
          <button @click="closeClassModal" class="btn btn-secondary">
            Abbrechen
          </button>
          <button @click="addClass" class="btn btn-primary">Erstellen</button>
        </div>
      </div>
    </div>

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
.teacher-switch {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background-color: #e2e8f0;
  border-radius: 6px;
  display: inline-block;
}

.teacher-switch select {
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  border: 1px solid #cbd5e0;
}

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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.modal-content input {
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>