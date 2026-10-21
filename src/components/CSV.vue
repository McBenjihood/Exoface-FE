<script setup lang="ts">
import { useRouter } from 'vue-router';
import Papa from 'papaparse';

const router = useRouter();

function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      const klassenMap: { [klassenName: string]: any[] } = {};

      results.data.forEach((row: any) => {
        const klasse = row.Klasse?.trim();
        const firstname = row.Vorname?.trim();
        const surname = row.Name?.trim();
        const email = row['E-Mail']?.trim();

        if (klasse && (firstname || surname)) {
          if (!klassenMap[klasse]) {
            klassenMap[klasse] = [];
          }

          klassenMap[klasse].push({
            name: firstname || '',
            surname: surname || '',
            email: email || ''
          });
        }
      });

      const alleKlassenData = Object.keys(klassenMap).map(klassenName => ({
        klasseName: klassenName,
        students: klassenMap[klassenName]
      }));

      console.log("Eingelesene Klassen und Schüler:", alleKlassenData);

      router.push({
        path: '/overview',
        state: {
          importedPayload: alleKlassenData
        }
      });
    },
    error: (err) => {
      console.error('Fehler beim Einlesen der CSV:', err);
    }
  });
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
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
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
  background-color: #edf2f7;
  color: #2d3748;
  border: 1px solid #cbd5e0;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
}
</style>