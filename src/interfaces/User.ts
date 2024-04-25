import { Schedule } from "./Schedule";

export type User = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: Date;
  department: string;
  isHumanResources: boolean;
  hourBalance: number;
  schedule?: Schedule;
  createdAt: Date;
  updatedAt: Date;
};
