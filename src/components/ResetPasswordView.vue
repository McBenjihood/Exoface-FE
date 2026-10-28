<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { sendResetCode, checkResetCode, setNewPassword } from "../api";

const router = useRouter();

const step = ref(1);
const email = ref("");
const otp = ref("");
const passwort = ref("");
const passwortConfirm = ref("");
const error = ref("");

async function handleSendCode() {
  error.value = "";
  if (email.value.trim() === "") {
    error.value = "Bitte gib deine E-Mail ein";
    return;
  }
  try {
    await sendResetCode(email.value);
    step.value = 2;
  } catch (e) {
    error.value = (e as Error).message;
  }
}

async function handleCheckCode() {
  error.value = "";
  try {
    await checkResetCode(email.value, otp.value);
    step.value = 3;
  } catch (e) {
    error.value = (e as Error).message;
  }
}

async function handleSetPassword() {
  error.value = "";
  if (passwort.value.length < 8) {
    error.value = "Das Passwort muss mindestens 8 Zeichen lang sein";
    return;
  }
  if (passwort.value !== passwortConfirm.value) {
    error.value = "Die Passwörter stimmen nicht überein";
    return;
  }
  await setNewPassword(email.value, passwort.value);
  router.push("/login");
}

function handleSubmit() {
  if (step.value === 1) {
    handleSendCode();
  } else if (step.value === 2) {
    handleCheckCode();
  } else {
    handleSetPassword();
  }
}
</script>

<template>
  <main class="login">
    <form class="block" @submit.prevent="handleSubmit">
      <img class="logo" src="/logo.png" alt="logo" />
      <h1>Passwort setzen</h1>

      <p v-if="step === 1" class="notice">
        Gib deine E-Mail ein. Wir schicken dir einen Code.
      </p>
      <p v-if="step === 2" class="notice">
        Wir haben dir einen Code an {{ email }} geschickt.
      </p>
      <p v-if="step === 3" class="notice">Wähle jetzt ein neues Passwort.</p>

      <label for="email">E-Mail</label>
      <input id="email" v-model="email" type="email" :disabled="step > 1" />

      <template v-if="step === 2">
        <label for="otp">Code</label>
        <input id="otp" v-model="otp" type="text" inputmode="numeric" maxlength="6" />
      </template>

      <template v-if="step === 3">
        <label for="passwort">Neues Passwort</label>
        <input id="passwort" v-model="passwort" type="password" />

        <label for="passwortConfirm">Passwort bestätigen</label>
        <input id="passwortConfirm" v-model="passwortConfirm" type="password" />
      </template>

      <p v-if="error" class="error">{{ error }}</p>

      <a class="link" href="/login">Zurück zur Anmeldung</a>

      <button type="submit">
        <template v-if="step === 1">Code senden</template>
        <template v-if="step === 2">Code prüfen</template>
        <template v-if="step === 3">Passwort setzen</template>
      </button>
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

.notice {
  margin: 0 0 20px;
  font-size: 13px;
  line-height: 1.5;
  color: #5a6b77;
}

input:disabled {
  color: #5a6b77;
  background-color: #f4f7f9;
}

.error {
  margin: 0 0 12px;
  font-size: 13px;
  color: #dc2626;
}
</style>
