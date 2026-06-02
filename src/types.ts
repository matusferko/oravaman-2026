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

export type RaceLeg = {
  kind: "s" | "b" | "r";
  title: string;
  meta: string;
  detail: string;
};

export type Fact = {
  value: string;
  label: string;
};

export type PlanContent = {
  facts: Fact[];
  weeks: WeekPlan[];
  legs: RaceLeg[];
};
