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