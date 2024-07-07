import {Freq, WeekDay} from "../rrule/rrule-constants";

export interface RepeatingPattern {
  id: number,
  frequency: Freq;
  weekDays: WeekDay[] | null;
  setPos: -1 | 1 | 2 | 3 | null;
  interval: number;
  occurrenceCount: number | null;
  rruleText: string | null;
  rruleString: string | null;
  endDate: string | null;
}
