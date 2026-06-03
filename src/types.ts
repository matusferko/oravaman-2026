export type DayPlan = {
  date: string;
  color: string;
  type: string;
  session: string;
  key?: boolean;
  race?: boolean;
};

export type WeekPlan = {
  tag: string;
  range: string;
  phase: string;
  hours: string;
  focus: string;
  days: DayPlan[];
};

export type PlanContent = {
  weeks: WeekPlan[];
};
