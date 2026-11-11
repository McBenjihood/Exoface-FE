<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { getUser } from "../auth";
import { vms } from "../mockData";
import { vmWerte, balkenFarbe } from "../vmValues";

const props = defineProps<{
  vmID: string;
}>();

const router = useRouter();
const user = getUser();

const modules = [
  { moduleID: 1, abbreviation: "M111", description: "Netzwerke und Serverinfrastruktur" },
  { moduleID: 2, abbreviation: "M183", description: "Applikationssicherheit implementieren" },
  { moduleID: 3, abbreviation: "M306", description: "IT-Projekte abwickeln" },
];

const vm = computed(() => vms.find((v) => v.vmID === Number(props.vmID)));

const werte = computed(() => (vm.value ? vmWerte(vm.value) : []));

const modul = computed(() =>
    modules.find((m) => m.moduleID === vm.value?.moduleID),
);

const konsole = computed(() => {
  if (!vm.value) return [];

  if (vm.value.status === "active") {
    return [
      "[  OK  ] Started Journal Service.",
      "[  OK  ] Reached target Network.",
      "[  OK  ] Started OpenSSH server daemon.",
      "[  OK  ] Reached target Multi-User System.",
      "",
      (vm.value.template ?? "Ubuntu 24.04 LTS") + " " + vm.value.name + " tty1",
      "",
      vm.value.name + " login: ",
    ];
  }

  return [
    "[  OK  ] Stopped OpenSSH server daemon.",
    "[  OK  ] Reached target Power-Off.",
    "",
    "Die VM ist gestoppt. Starte sie, um die Konsole zu benutzen.",
  ];
});

function handleStartStop() {
  if (!vm.value) return;
  vm.value.status = vm.value.status === "active" ? "inactive" : "active";
}

function handleReset() {
  console.log("Reset:", vm.value?.name);
}

function handleDelete() {
  const index = vms.findIndex((v) => v.vmID === Number(props.vmID));
  if (index !== -1) {
    vms.splice(index, 1);
  }
  router.back();
}
</script>

<template>
  <main class="page">
    <div class="top">
      <button class="back" @click="router.back()" title="Zurück">
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <template v-if="vm">
        <span class="name">{{ vm.name }}</span>
        <span class="status" :class="vm.status">
          {{ vm.status === "active" ? "läuft" : "gestoppt" }}
        </span>

        <div class="buttons">
          <button>SSH Manager</button>
          <button @click="handleReset">Zurücksetzen</button>
          <button
              v-if="user?.role === 'teacher'"
              class="loeschen"
              @click="handleDelete"
          >
            Löschen
          </button>
          <button class="haupt" @click="handleStartStop">
            {{ vm.status === "active" ? "Stoppen" : "Starten" }}
          </button>
        </div>
      </template>
    </div>

    <p v-if="!vm" class="leer">VM nicht gefunden.</p>

    <template v-else>
      <div class="werte">
        <div v-for="wert in werte" :key="wert.name" class="wert">
          <div class="wert-name">{{ wert.name }}</div>
          <div class="wert-zahl">{{ wert.text }}</div>
          <div class="balken">
            <span
                :style="{
                width: wert.prozent + '%',
                backgroundColor: balkenFarbe(wert.prozent),
              }"
            ></span>
          </div>
        </div>
      </div>

      <div class="console">
        <div class="console-bar">
          <span>Konsole</span>
          <span>{{ vm.ip }}</span>
        </div>
        <pre class="console-text">{{ konsole.join("\n") }}<span class="cursor">_</span></pre>
      </div>

      <table class="details">
        <tr>
          <th>Modul</th>
          <td>
            <template v-if="modul">
              {{ modul.abbreviation }} · {{ modul.description }}
            </template>
          </td>
        </tr>
        <tr>
          <th>Betriebssystem</th>
          <td>{{ vm.template ?? "Ubuntu 24.04 LTS" }}</td>
        </tr>
        <tr>
          <th>Adresse</th>
          <td>{{ vm.ip }}</td>
        </tr>
        <tr>
          <th>Uptime</th>
          <td>{{ vm.status === "active" ? vm.uptime : "–" }}</td>
        </tr>
        <tr>
          <th>Gehört zu</th>
          <td>{{ vm.studentName }}</td>
        </tr>
      </table>
    </template>
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
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.back {
  display: flex;
  padding: 4px;
  color: var(--text);
  background: none;
  border: none;
  cursor: pointer;
}

.back:hover {
  color: var(--primary);
}

.name {
  padding: 3px 10px;
  font-family: Consolas, "Courier New", monospace;
  font-weight: 600;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
}

.status {
  font-size: 13px;
}

.status.active {
  color: var(--success);
}

.status.inactive {
  color: var(--danger);
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: auto;
}

.buttons button {
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

.buttons button:hover {
  background-color: var(--surface-2);
}

.buttons .haupt {
  color: var(--on-primary);
  background-color: var(--primary);
  border-color: var(--primary);
}

.buttons .haupt:hover {
  background-color: var(--primary-hover);
}

.buttons .loeschen:hover {
  color: var(--danger);
  border-color: var(--danger);
}

.werte {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.wert {
  flex: 1;
  padding: 14px 16px;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.wert-name {
  font-size: 13px;
  color: var(--text-muted);
}

.wert-zahl {
  margin-top: 4px;
  font-size: 18px;
  font-weight: 600;
}

.balken {
  height: 6px;
  margin-top: 10px;
  overflow: hidden;
  background-color: var(--surface-2);
  border-radius: 3px;
}

.balken span {
  display: block;
  height: 100%;
}

.console {
  min-height: 240px;
  margin-bottom: 16px;
  padding: 16px;
  background-color: #12242e;
  border-radius: 8px;
}

.console-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #dde5ea;
}

.console-bar span:last-child {
  font-family: Consolas, "Courier New", monospace;
  font-weight: normal;
  color: #94a6b5;
}

.console-text {
  margin: 0;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #b8c4cc;
  white-space: pre-wrap;
}

.cursor {
  animation: blinken 1s steps(1) infinite;
}

@keyframes blinken {
  50% {
    opacity: 0;
  }
}

.details {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.details th,
.details td {
  padding: 10px 16px;
  text-align: left;
  font-size: 14px;
  border-bottom: 1px solid var(--border);
}

.details tr:last-child th,
.details tr:last-child td {
  border-bottom: none;
}

.details th {
  width: 160px;
  font-weight: normal;
  color: var(--text-muted);
}

.leer {
  color: var(--text-muted);
}

@media (max-width: 600px) {
  .buttons {
    width: 100%;
    margin-left: 0;
  }

  .buttons button {
    flex: 1;
    padding: 0 6px;
  }

  .werte {
    flex-direction: column;
  }

  .details th {
    width: auto;
  }
}
</style>