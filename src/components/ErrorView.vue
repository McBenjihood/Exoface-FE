<script setup lang="ts">
import { useRouter } from "vue-router";
import { getUser } from "../auth";

const router = useRouter();
const user = getUser();

function zurueck() {
  router.push(user ? "/overview" : "/login");
}
</script>

<template>
  <main class="nf">
    <div class="box">
      <p class="code">404</p>
      <h1>Seite nicht gefunden</h1>
      <p class="text">
        Diese Adresse gibt es nicht. Vielleicht hast du dich vertippt
        oder der Link ist veraltet.
      </p>
      <button class="btn" @click="zurueck">
        {{ user ? "Zur Übersicht" : "Zur Anmeldung" }}
      </button>
    </div>
  </main>
</template>

<style scoped>
.nf {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70dvh;
  padding: 24px;
}

.box {
  max-width: 420px;
  text-align: center;
}

.code {
  margin: 0;
  font-size: 64px;
  font-weight: 700;
  line-height: 1;
  color: var(--primary);
}

h1 {
  margin: 8px 0 12px;
  font-size: 22px;
}

.text {
  margin: 0 0 24px;
  font-size: 15px;
  color: var(--text-muted);
}

.btn {
  height: 36px;
  padding: 0 18px;
  font-family: inherit;
  font-size: 14px;
  color: var(--on-primary);
  background-color: var(--primary);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: var(--primary-hover);
}
</style>