import { ref, watch } from "vue";

type Theme = "light" | "dark";

const gespeichert = localStorage.getItem("theme") as Theme | null;
const systemDunkel = window.matchMedia("(prefers-color-scheme: dark)").matches;

export const theme = ref<Theme>(gespeichert ?? (systemDunkel ? "dark" : "light"));

watch(
    theme,
    (neu) => {
        document.documentElement.dataset.theme = neu;
        localStorage.setItem("theme", neu);
    },
    { immediate: true },
);

export function toggleTheme() {
    theme.value = theme.value === "dark" ? "light" : "dark";
}