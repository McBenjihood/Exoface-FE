<script setup lang="ts">
import { ref } from 'vue';
import Papa from 'papaparse';
import router from '../router.ts';
const parsedData = ref<any[]>([]);

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      console.log('Erfolgreich umgewandelt:', results.data);
      parsedData.value = results.data;
    },
    error: (error) => {
      console.error('Fehler beim Parsem:', error);
    }
  });
  router.push('/teacherclassview');
}
</script>

<template>
  <div class="csv-upload-container">
    <h3>CSV-Datei auswählen & umwandeln</h3>

    <input
        type="file"
        accept=".csv"
        @change="handleFileUpload"
    />


  </div>
</template>

<style scoped>
.csv-upload-container {
  padding: 1.5rem;
  background-color: #f7fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.preview {
  margin-top: 1rem;
  background-color: #1a202c;
  color: #63b3ed;
  padding: 1rem;
  border-radius: 6px;
  max-height: 300px;
  overflow-y: auto;
}

pre {
  margin: 0;
  font-family: monospace;
}
</style>>