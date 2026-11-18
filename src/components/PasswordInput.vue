<script setup lang="ts">
import { ref } from "vue";
import Icon from "./Icon.vue";

defineOptions({ inheritAttrs: false });

const passwort = defineModel<string>({ required: true });
const sichtbar = ref(false);
</script>

<template>
  <div class="feld">
    <input
        v-model="passwort"
        :type="sichtbar ? 'text' : 'password'"
        v-bind="$attrs"
    />
    <button
        class="auge"
        type="button"
        :title="sichtbar ? 'Passwort verbergen' : 'Passwort anzeigen'"
        :aria-label="sichtbar ? 'Passwort verbergen' : 'Passwort anzeigen'"
        :aria-pressed="sichtbar"
        @click="sichtbar = !sichtbar"
    >
      <Icon :name="sichtbar ? 'eye-off' : 'eye'" :size="18" />
    </button>
  </div>
</template>

<style scoped>
.feld {
  position: relative;
  display: flex;
  margin-bottom: 14px;
}

input {
  box-sizing: border-box;
  width: 100%;
  height: 34px;
  padding: 0 38px 0 10px;
  font-family: inherit;
  font-size: 14px;
  color: #12242e;
  background-color: #ffffff;
  border: 1px solid #b8c4cc;
}

input::-ms-reveal {
  display: none;
}

.auge {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0;
  color: #5a6b77;
  background: none;
  border: none;
  cursor: pointer;
}

.auge:hover {
  color: #12242e;
}
</style>