export type Schedule = {
  id: string;
  entry: Date;
  intervalEntry: Date;
  intervalExit: Date;
  exit: Date;
  createdAt: Date;
  updatedAt: Date;
};

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
