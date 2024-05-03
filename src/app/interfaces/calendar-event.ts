import {RepeatingPattern} from "./repeating-pattern";

export interface CalendarEvent {
  id: number;
  from: Date;
  duration: number;
  until?: Date;
  isRepeating: boolean;
  repeatingPattern?: RepeatingPattern;
  title?: string;
  description?: string;
}
