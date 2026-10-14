<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const passwort = ref("");

localStorage.setItem("teacherEmail", email.value.trim());

function login() {
  if (email.value.trim() !== "") {
    localStorage.setItem("teacherEmail", email.value.trim());
    router.push("/teacherview");
  }
}
</script>

<template>
  <main class="login">
    <form class="block" @submit.prevent="login">
      <img class="logo" src="/logo.png" alt="logo" />
      <h1>Anmelden</h1>

      <label for="email">E-Mail</label>
      <input id="email" v-model="email" type="email" />

      <label for="passwort">Passwort</label>
      <input id="passwort" v-model="passwort" type="password" />

      <a class="link" href="/resetpassword">
        Erste Anmeldung oder Passwort vergessen?
      </a>
      <button type="submit">Anmelden</button>
    </form>
  </main>
</template>

<style scoped>
.login {
  min-height: 100dvh;
  background-image:
    linear-gradient(rgba(10, 22, 30, 0.55), rgba(10, 22, 30, 0.55)),
    url("/background.png");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.block {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 340px;
  padding: 30px 36px 36px;
  background-color: #ffffff;
}

.logo {
  align-self: flex-start;
  height: 27px;
  width: auto;
  margin-bottom: 18px;
  margin-left: -4px;
}

h1 {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 600;
}

.link {
  margin-bottom: 22px;
  font-size: 13px;
  color: #0284c7;
  text-decoration: none;
}

label {
  margin-bottom: 4px;
  font-size: 12px;
}

input {
  height: 34px;
  margin-bottom: 14px;
  padding: 0 10px;
  font-family: inherit;
  font-size: 14px;
  border: 1px solid #b8c4cc;
}

button {
  align-self: flex-end;
  min-width: 104px;
  height: 34px;
  font-family: inherit;
  font-size: 14px;
  color: #ffffff;
  background-color: #0369a1;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #075985;
}
</style>
