export type Role = "teacher" | "student";

export interface User {
  role: Role;
  name: string;
  email: string;
}

const mockUsers: User[] = [
  { role: "teacher", name: "Max Muster", email: "max.muster@sluz.ch" },
  { role: "student", name: "Jan Huppertz", email: "jan.huppertz@sluz.ch" },
];

export async function login(email: string, passwort: string): Promise<User> {
  const user = mockUsers.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (!user || passwort === "") {
    throw new Error("E-Mail oder Passwort falsch");
  }
  return user;
}

export async function sendResetCode(email: string) {
    const user = mockUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!user) {
        throw new Error("Zu dieser E-Mail gibt es kein Konto");
    }
}

export async function checkResetCode(email: string, otp: string) {
    console.log("Code prüfen für", email);
    if (otp !== "123456") {
        throw new Error("Der Code ist falsch");
    }
}

export async function setNewPassword(email: string, passwort: string) {
    console.log("Neues Passwort gesetzt für", email, "mit", passwort.length, "Zeichen");
}