import { authHeader } from "./auth";

export type Role = "teacher" | "student" | "admin";

export interface User {
    userId: number;
    role: Role;
    email: string;
}

interface JwtPayload {
    sub: string;
    email: string;
    role: Role;
    exp: number;
    iss: string;
}


function base64UrlDecode(input: string): string {
    const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), "=");
    const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

export function decodeToken(token: string): JwtPayload {
    const teil = token.split(".")[1];
    if (!teil) throw new Error("Ungültiger Token");
    return JSON.parse(base64UrlDecode(teil)) as JwtPayload;
}

async function post(pfad: string, body: unknown) {
    const res = await fetch(`/api${pfad}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const daten = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(daten.error ?? daten.message ?? "Da ist etwas schiefgelaufen");
    }
    return daten;
}

//auth

export async function login(
    email: string,
    passwort: string,
): Promise<{ user: User; token: string }> {
    const daten = await post("/auth/login", {
        email: email.trim().toLowerCase(),
        password: passwort,
    });

    const token: string = daten.token;
    const payload = decodeToken(token);

    const user: User = {
        userId: Number(payload.sub),
        role: payload.role,
        email: payload.email,
    };

    return { user, token };
}

export async function sendResetCode(email: string) {
    await post("/auth/init-register", { email: email.trim().toLowerCase() });
}

export async function setNewPassword(email: string, otp: string, passwort: string) {
    await post("/auth/verify-register", {
        email: email.trim().toLowerCase(),
        otp,
        password: passwort,
    });
}

//vms

async function authFetch(pfad: string, init: RequestInit = {}) {
    const res = await fetch(`/api${pfad}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...authHeader(),
            ...(init.headers ?? {}),
        },
    });

    if (res.status === 401) {
        throw new Error("Deine Sitzung ist abgelaufen. Bitte melde dich neu an.");
    }
    if (res.status === 403) {
        throw new Error("Dafür fehlen dir die Berechtigungen.");
    }

    const daten = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(daten.error ?? daten.message ?? `Fehler ${res.status}`);
    }
    return daten;
}

export interface ApiInstanceType {
    id: string;
    family: string;
    size: string;
    cpus: number;
    memory: number;
}

export interface ApiTemplate {
    id: string;
    name: string;
    family?: string;
    description?: string;
    size?: number;
}

export interface CreatedVm {
    uuid: string;
    name: string;
    userId: number;
}

export async function getInstanceTypes(): Promise<ApiInstanceType[]> {
    const daten = await authFetch("/exoscale/types");
    return daten.instanceTypes ?? [];
}

export async function getTemplates(): Promise<ApiTemplate[]> {
    const daten = await authFetch("/exoscale/templates");
    return daten.templates ?? [];
}

export async function createVm(params: {
    targetUserId: number;
    name: string;
    templateId: string;
    instanceTypeId: string;
    diskSize?: number;
}): Promise<CreatedVm> {
    const daten = await authFetch("/exoscale/create", {
        method: "POST",
        body: JSON.stringify(params),
    });
    return daten.vm as CreatedVm;
}

export function bytesZuGb(bytes: number): number {
    return Math.round(bytes / 1024 ** 3);
}

export function typLabel(t: ApiInstanceType): string {
    const gb = t.memory / 1024 ** 3;
    const ram = gb < 1 ? `${Math.round(gb * 1024)} MB` : `${gb} GB`;
    return `${t.family} ${t.size} · ${ram} RAM · ${t.cpus} ${t.cpus === 1 ? "Core" : "Cores"}`;
}

export interface ApiStudent {
    userId: number | null;
    name: string;
    surname: string;
    email: string;
    registriert: boolean;
}

export async function getStudents(klasse: string): Promise<ApiStudent[]> {
    const daten = await authFetch(`/class/${encodeURIComponent(klasse)}/students`);
    return daten.data ?? [];
}

export interface ApiVm {
    uuid: string;
    name: string;
    userId: number;
}

export async function getVmList(): Promise<ApiVm[]> {
    const daten = await authFetch("/exoscale/vms");
    return daten.vms ?? [];
}