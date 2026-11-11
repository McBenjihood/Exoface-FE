export interface InstanceType {
    name: string;
    ram: number;
    cpu: number;
    diskMin: number;
    diskMax: number;
    preis: number;
}

export const instanceTypes: InstanceType[] = [
    { name: "Micro", ram: 0.5, cpu: 1, diskMin: 10, diskMax: 200, preis: 0.00729 },
    { name: "Tiny", ram: 1, cpu: 1, diskMin: 10, diskMax: 400, preis: 0.01458 },
    { name: "Small", ram: 2, cpu: 2, diskMin: 10, diskMax: 400, preis: 0.02333 },
    { name: "Medium", ram: 4, cpu: 2, diskMin: 10, diskMax: 400, preis: 0.04666 },
    { name: "Large", ram: 8, cpu: 4, diskMin: 10, diskMax: 400, preis: 0.09333 },
    { name: "Extra-Large", ram: 16, cpu: 4, diskMin: 10, diskMax: 800, preis: 0.18667 },
    { name: "Huge", ram: 32, cpu: 8, diskMin: 10, diskMax: 800, preis: 0.37334 },
    { name: "Mega", ram: 64, cpu: 12, diskMin: 10, diskMax: 800, preis: 0.74667 },
    { name: "Titan", ram: 128, cpu: 16, diskMin: 10, diskMax: 1600, preis: 1.49333 },
    { name: "Jumbo", ram: 225, cpu: 24, diskMin: 10, diskMax: 1600, preis: 2.24 },
];

export function ramText(gb: number) {
    if (gb < 1) return gb * 1024 + " MB";
    return gb + " GB";
}

export function diskText(gb: number) {
    if (gb >= 1000) return gb / 1000 + " TB";
    return gb + " GB";
}
export const templates = [
    "Ubuntu 24.04 LTS",
    "Ubuntu 22.04 LTS",
    "Debian 12",
    "Rocky Linux 9",
];