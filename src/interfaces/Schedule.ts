export type Schedule = {
  id: string;
  entry: Date;
  intervalEntry?: Date;
  intervalExit?: Date;
  exit?: Date;
  hourBalance: number;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
};
