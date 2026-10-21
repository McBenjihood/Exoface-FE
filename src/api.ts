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
