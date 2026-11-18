import type { Vm } from "./mockData";
import { instanceTypes } from "./instanceTypes";

function maximum(wert: string) {
    return (wert.split("/")[1] ?? wert).trim();
}

export function vmWerte(vm: Vm) {
    const typ = instanceTypes.find((t) => t.name === vm.typ);

    return [
        { name: "CPU", text: typ ? `${typ.cpu} ${typ.cpu === 1 ? "Core" : "Cores"}` : "–" },
        { name: "RAM", text: maximum(vm.ram) },
        { name: "Disk", text: maximum(vm.storage) },
    ];
}

export function laufendeVms(liste: Vm[]) {
    return liste.filter((v) => v.status === "active").length;
}