<script setup lang="ts">
import { ref } from "vue";
import Navbar from "./Navbar.vue";
import router from "../router.ts";

const props = defineProps<{
  modulName: string;
  klassenTitle: string;
}>();

interface Student {
  id: number;
  name: string;
  ip: string;
  uptime: string;
  cpu: string;
  ram: string;
  storage: string;
  status: "active" | "inactive";
  expanded: boolean;
}

const students = ref<Student[]>([
  {
    id: 1,
    name: "Schüler 1",
    ip: "178.162.00.01:2000",
    uptime: "2h 17min",
    cpu: "50 / 100%",
    ram: "5 GB / 16 GB",
    storage: "50 GB / 100 GB",
    status: "active",
    expanded: false,
  },
  {
    id: 2,
    name: "Schüler 2",
    ip: "178.162.00.02:2000",
    uptime: "1h 05min",
    cpu: "20 / 100%",
    ram: "4 GB / 16 GB",
    storage: "30 GB / 100 GB",
    status: "active",
    expanded: false,
  },
  {
    id: 3,
    name: "Schüler 3",
    ip: "178.162.00.03:2000",
    uptime: "0h 45min",
    cpu: "10 / 100%",
    ram: "2 GB / 16 GB",
    storage: "20 GB / 100 GB",
    status: "inactive",
    expanded: false,
  },
  {
    id: 4,
    name: "Max Muster",
    ip: "178.162.00.01:2000",
    uptime: "2h 17min",
    cpu: "50 / 100%",
    ram: "5 GB / 16 GB",
    storage: "50 GB / 100 GB",
    status: "active",
    expanded: true,
  },
]);

function toggleExpand(student: Student) {
  student.expanded = !student.expanded;
}

function handleStartStop(student: Student) {
  student.status = student.status === "active" ? "inactive" : "active";
}

function handleReset(student: Student) {
  console.log("Reset:", student.name);
}

function handleDelete(id: number) {
  students.value = students.value.filter((s) => s.id !== id);
}
function backtolast() {
  router.push("/teacherview");
}
function uploadcsv() {
  router.push("/csv");
}
</script>

<template>
  <div class="page-wrapper">
    <main class="class-view-container">
      <!-- Header Navigation -->
      <div class="top-header">
        <button
          @click="backtolast"
          class="icon-btn back-btn"
          aria-label="Zurück"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div class="header-tags">
          <span class="badge badge-outline">{{ klassenTitle }}</span>
          <span class="module-title">{{ modulName }}</span>
          <button
            @click="uploadcsv"
            class="icon-btn upload-btn"
            aria-label="Upload CSV"
          ></button>
        </div>
      </div>

      <div class="student-list">
        <div
          v-for="student in students"
          :key="student.id"
          class="student-card"
          :class="{ expanded: student.expanded }"
        >
          <!-- Header Zeile -->
          <div class="student-header" @click="toggleExpand(student)">
            <span class="student-name">{{ student.name }}</span>

            <div class="header-right">
              <span
                class="status-dot"
                :class="student.status"
                :title="student.status === 'active' ? 'Aktiv' : 'Inaktiv'"
              ></span>

              <svg
                class="chevron"
                :class="{ open: student.expanded }"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>

          <!-- Detail Panel -->
          <div v-if="student.expanded" class="student-details">
            <div class="info-content">
              <div class="info-group">
                <span class="info-label">Name</span>
                <span class="info-value">{{ student.name }}</span>
              </div>

              <div class="info-group">
                <span class="ip-address">{{ student.ip }}</span>
                <span class="uptime">uptime: {{ student.uptime }}</span>
              </div>

              <div class="metrics-row">
                <div class="metric-item">
                  <span class="metric-icon">💻</span>
                  <span>{{ student.cpu }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-icon">📊</span>
                  <span>{{ student.ram }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-icon">💾</span>
                  <span>{{ student.storage }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="action-buttons">
              <button class="btn btn-action" @click="handleStartStop(student)">
                {{ student.status === "active" ? "Stop" : "Start" }}
              </button>
              <button class="btn btn-action" @click="handleReset(student)">
                Reset
              </button>
              <button
                class="btn btn-action btn-danger"
                @click="handleDelete(student.id)"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-wrapper {
  width: 100%;
  min-height: 100vh;
}

.navbar-container {
  width: 100%;
}

.class-view-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
  color: #2d3748;
}

.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.header-tags {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-right: 40rem;
}

.badge-outline {
  border: 2px solid #2d3748;
  border-radius: 6px;
  padding: 0.2rem;

  font-weight: 600;
  font-size: 1rem;
}

.module-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #4a5568;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #2d3748;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  transition: opacity 0.2s;
}

.icon-btn:hover {
  opacity: 0.7;
}

.student-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.student-card {
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.student-card.expanded {
  border-color: #3182ce;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.student-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  cursor: pointer;
  user-select: none;
  background-color: #ffffff;
}

.student-header:hover {
  background-color: #f7fafc;
}

.student-name {
  font-weight: 600;
  font-size: 1.05rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.status-dot.active {
  background-color: #38a169;
}

.status-dot.inactive {
  background-color: #e53e3e;
}

.chevron {
  transition: transform 0.2s ease;
  color: #718096;
}

.chevron.open {
  transform: rotate(180deg);
}

.student-details {
  border-top: 1px solid #e2e8f0;
  padding: 1.25rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem;
  background-color: #ffffff;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-group {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.8rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-weight: 600;
  font-size: 1.1rem;
}

.ip-address {
  font-family: monospace;
  font-size: 1rem;
  color: #2d3748;
}

.uptime {
  font-size: 0.9rem;
  color: #718096;
}

.metrics-row {
  display: flex;
  gap: 1.25rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
}

.btn {
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  min-width: 90px;
  text-align: center;
}

.btn-action {
  background-color: #ffffff;
  border: 1px solid #cbd5e0;
  color: #2d3748;
}

.btn-action:hover {
  background-color: #edf2f7;
}

.btn-danger {
  color: #e53e3e;
  border-color: #feb2b2;
}

.btn-danger:hover {
  background-color: #fff5f5;
  border-color: #e53e3e;
}
</style>
