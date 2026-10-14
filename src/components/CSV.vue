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
      let detectedKlasse = '';

      const students = results.data.map((row: any) => {
        // Klasse aus der CSV-Spalte "Klasse" / "class" ermitteln
        if (!detectedKlasse && (row.Klasse || row.klasse || row.Class || row.class)) {
          detectedKlasse = (row.Klasse || row.klasse || row.Class || row.class).trim();
        }

        // Vor- und Nachnamen ermitteln
        let firstname = row.Vorname || row.vorname || row.Firstname || row.firstname || '';
        let surname = row.Nachname || row.nachname || row.Surname || row.surname || '';

        if (!firstname && !surname) {
          const rawName = row.Name || row.name || '';
          const nameParts = rawName.trim().split(' ');
          surname = nameParts.length > 1 ? nameParts.pop() || '' : '';
          firstname = nameParts.join(' ');
        }

        return {
          name: firstname.trim(),
          surname: surname.trim(),
          email: row.Email || row.email || ''
        };
      }).filter(s => s.name || s.surname);

      // Falls keine Klasse in der Spalte vorhanden war, Fallback aus Dateiname
      if (!detectedKlasse) {
        detectedKlasse = file.name.replace(/\.[^/.]+$/, "");
      }

      // Direkt zum TeacherView navigieren und die ausgelesenen Daten im Router-State mitgeben
      router.push({
        path: '/teacherview',
        state: {
          importedPayload: {
            klasseName: detectedKlasse,
            students: students
          }
        }
      });
    },
    error: (err) => {
      console.error('Fehler beim Lesen der CSV:', err);
    }
  });
}

function cancel() {
  router.push('/teacherview');
}
</script>

<template>
  <div class="csv-container">
    <h2>CSV-Datei auswählen</h2>
    <p class="info-text">Wähle eine CSV-Datei aus. Die Klasse und Schüler werden automatisch ausgelesen.</p>

    <div class="file-box">
      <input
          type="file"
          accept=".csv"
          id="file-input"
          class="hidden-input"
          @change="handleFileUpload"
      />
      <label for="file-input" class="btn btn-primary">
        📁 CSV-Datei hochladen
      </label>
    </div>

    <button @click="cancel" class="btn btn-secondary cancel-btn">Abbrechen</button>
  </div>
</template>

<style scoped>
.csv-container {
  max-width: 500px;
  margin: 3rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  text-align: center;
  font-family: sans-serif;
}

.info-text {
  color: #718096;
  margin-bottom: 1.5rem;
}

.hidden-input {
  display: none;
}

.file-box {
  margin-bottom: 1.5rem;
}

.btn {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary {
  background-color: #3182ce;
  color: white;
}

.btn-secondary {
  background-color: #edf2f7;
  color: #2d3748;
}
</style>