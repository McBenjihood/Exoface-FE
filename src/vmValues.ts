import type { Vm } from "./mockData";

export function prozent(wert: string) {
    const teile = wert.replace("%", "").split("/");
    const belegt = parseFloat(teile[0] ?? "");
    const total = parseFloat(teile[1] ?? "");
    if (!total) return 0;
    return Math.round((belegt / total) * 100);
}

export function balkenFarbe(wert: number) {
    if (wert >= 90) return "var(--danger)";
    if (wert >= 70) return "var(--warn)";
    return "var(--primary)";
}

export function vmWerte(vm: Vm) {
    const laeuft = vm.status === "active";

    return [
        { name: "CPU", text: laeuft ? vm.cpu : "–", prozent: laeuft ? prozent(vm.cpu) : 0 },
        { name: "RAM", text: laeuft ? vm.ram : "–", prozent: laeuft ? prozent(vm.ram) : 0 },
        { name: "Disk", text: vm.storage, prozent: prozent(vm.storage) },
    ];
}

export function laufendeVms(liste: Vm[]) {
    return liste.filter((v) => v.status === "active").length;
}