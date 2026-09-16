<script setup lang="ts">
import { ref } from 'vue';
import Navbar from './Navbar.vue';
import router from "../router.ts";
const activeModul = ref<any>(null);
const module = ref([
  {
    name: 'M111',
    klassen: [
      { title: 'D24a', status: '3 / 7 aktiv', active: true },
      { title: 'Klasse 2', status: 'Status', active: false },
      { title: 'Klasse 3', status: 'Status', active: false }
    ]
  }
]);

const showModal = ref(false);
const showClassModal = ref(false);
const newModulName = ref('');
const newClassName = ref('');

function openModal() {
  newModulName.value = '';
  showModal.value = true;
}
function openClassModal(modul: any) {
  activeModul.value = modul;
  newClassName.value = '';
  showClassModal.value = true;
}

function closeModal() {
  showModal.value = false;
}
function closeClassModal() {
  showClassModal.value = false;
}

function addModul() {
  if (newModulName.value.trim() !== '') {
    module.value.push({
      name: newModulName.value.trim(),
      klassen: []
    });
    closeModal();
  }
}
function addClass() {
  if (newClassName.value.trim() !== '' && activeModul.value) {
    activeModul.value.klassen.push({
      title: newClassName.value.trim(),
      status: 'Aktiv',
      active: true
    });
    closeClassModal();
  }
}
function pushtoclassview()
{
  router.push('/TeacherClassView')
}
</script>

<template>
  <header>
    <Navbar />
  </header>

  <main class="dashboard">
    <h1 class="page-title">Hallo Lehrer</h1>

    <div v-for="(modul, mIndex) in module" :key="mIndex" class="modul-box-large">
      <div class="modul-header">
        <h2 class="modul-name">{{ modul.name }}</h2>
        <button @click="openClassModal(modul)" class="btn btn-primary">

          Klasse hinzufügen
        </button>
      </div>

      <div class="klassen-container">
        <div @click="pushtoclassview"
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

    <div v-if="showClassModal" class="modal-overlay" @click.self="closeClassModal">
      <div class="modal-content">
        <h3>Neue Klasse Hinzufügen</h3>
        <input
            v-model="newClassName"
            type="text"
            placeholder="D24a..."
            @keyup.enter="addClass"
            autofocus
        />
        <div class="modal-actions">
          <button @click="closeClassModal" class="btn btn-secondary">Abbrechen</button>
          <button @click="addClass" class="btn btn-primary">Erstellen</button>
        </div>
      </div>
    </div>

          <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
          <div class="modal-content">
            <h3>Neue Klasse hinzufügen</h3>
            <input
                v-model="newModulName"
                type="text"
                placeholder="M123..."
                @keyup.enter="addModul"
                autofocus
            />
            <div class="modal-actions">
              <button @click="closeModal" class="btn btn-secondary">Abbrechen</button>
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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
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
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
      font-size: 1.5rem;
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
      transition: transform 0.15s ease, box-shadow 0.15s ease;
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
      transition: background-color 0.2s ease, transform 0.1s ease;
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