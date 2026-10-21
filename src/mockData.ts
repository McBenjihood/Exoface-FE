import { reactive } from "vue";

export interface Vm {
  vmID: number;
  name: string;
  studentID: number;
  studentName: string;
  moduleID: number;
  ip: string;
  uptime: string;
  cpu: string;
  ram: string;
  storage: string;
  status: "active" | "inactive";
}

// Testdaten, bis das Backend steht. Alle Seiten lesen die VMs von hier,
// darum sieht man Start/Stop überall gleich.
export const vms = reactive<Vm[]>([
  {
    vmID: 1,
    name: "m111-d24a-schueler1",
    studentID: 1,
    studentName: "Schüler 1",
    moduleID: 1,
    ip: "178.162.00.01:2000",
    uptime: "2h 17min",
    cpu: "50 / 100%",
    ram: "5 GB / 16 GB",
    storage: "50 GB / 100 GB",
    status: "active",
  },
  {
    vmID: 2,
    name: "m111-d24a-schueler2",
    studentID: 2,
    studentName: "Schüler 2",
    moduleID: 1,
    ip: "178.162.00.02:2000",
    uptime: "1h 05min",
    cpu: "20 / 100%",
    ram: "4 GB / 16 GB",
    storage: "30 GB / 100 GB",
    status: "active",
  },
  {
    vmID: 3,
    name: "m111-d24a-schueler3",
    studentID: 3,
    studentName: "Schüler 3",
    moduleID: 1,
    ip: "178.162.00.03:2000",
    uptime: "0h 45min",
    cpu: "10 / 100%",
    ram: "2 GB / 16 GB",
    storage: "20 GB / 100 GB",
    status: "inactive",
  },
  {
    vmID: 4,
    name: "m111-d24a-muster",
    studentID: 4,
    studentName: "Max Muster",
    moduleID: 1,
    ip: "178.162.00.04:2000",
    uptime: "2h 17min",
    cpu: "50 / 100%",
    ram: "5 GB / 16 GB",
    storage: "50 GB / 100 GB",
    status: "active",
  },

  {
    vmID: 5,
    name: "m111-d24a-huppertz",
    studentID: 104,
    studentName: "Jan Huppertz",
    moduleID: 1,
    ip: "178.162.00.05:2000",
    uptime: "2h 17min",
    cpu: "50 / 100%",
    ram: "5 GB / 16 GB",
    storage: "50 GB / 100 GB",
    status: "active",
  },
  {
    vmID: 6,
    name: "m183-d24a-huppertz",
    studentID: 104,
    studentName: "Jan Huppertz",
    moduleID: 2,
    ip: "178.162.00.06:2000",
    uptime: "-",
    cpu: "0 / 100%",
    ram: "0 GB / 16 GB",
    storage: "12 GB / 100 GB",
    status: "inactive",
  },
  {
    vmID: 7,
    name: "m111-d24a-huppertz-2",
    studentID: 104,
    studentName: "Jan Huppertz",
    moduleID: 1,
    ip: "178.162.00.07:2000",
    uptime: "0h 30min",
    cpu: "15 / 100%",
    ram: "3 GB / 16 GB",
    storage: "20 GB / 100 GB",
    status: "active",
  },
]);
