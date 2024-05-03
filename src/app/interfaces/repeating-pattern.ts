import {Freq, WeekDay} from "../rrule/rrule-constants";

export interface RepeatingPattern {
  freq: Freq;
  weekDays?: WeekDay[];
  setPos?: -1 | 1 | 2 | 3;
  interval: number;
  occurrenceCount?: number;
}
