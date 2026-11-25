<script setup lang="ts">
import { useRouter } from 'vue-router';
import Papa from 'papaparse';
import {ref} from 'vue';

const router = useRouter();
const message = ref('');
function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      const payload = results.data.map((row: any) => ({
        name: row.Vorname?.trim() || '',
        surname: row.Name?.trim() || '',
        email: row['E-Mail']?.trim() || '',
        class: row.Klasse?.trim() || '',
        role: 'student'
      }));

      await sendToBackend(payload);
    },
    error: (err) => {
      console.error(err);
    }
  });
}
async function sendToBackend(data: any[]) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/import/importusers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    await fetch('http://localhost:3000/api/import/importclasses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      message.value = 'Erfolgreich';
      setTimeout(() => router.push('/overview'), 1500);
    } else {
      message.value = 'Fehler: ' +  result.error
    }
  } catch (e) {
    console.error(e);
  }
}
function cancel() {
  router.push('/overview');
}
</script>

<template>
  <div class="csv-container">
    <h2>Schüler-CSV importieren</h2>
    <p>Wähle die exportierte CSV-Datei aus:</p>

    <input type="file" accept=".csv" @change="handleFileUpload" class="file-input" />

    <div class="actions">
      <button @click="cancel" class="btn btn-secondary">Abbrechen</button>
    </div>
  </div>
</template>

<style scoped>
.csv-container {
  max-width: 500px;
  margin: 4rem auto;
  padding: 2rem;
  background: var(--surface);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border);
  text-align: center;
  font-family: inherit;
}

.file-input {
  margin: 1.5rem 0;
  display: block;
  width: 100%;
}

.btn {
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.btn-secondary {
  background-color: var(--surface-2);
  color: var(--text);
  border: 1px solid var(--border-strong);
}

.btn-secondary:hover {
  background-color: var(--primary-soft);
}
</style>