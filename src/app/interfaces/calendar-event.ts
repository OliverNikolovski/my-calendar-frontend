import {RepeatingPattern} from "./repeating-pattern";

export interface CalendarEvent {
  id: number;
  startDate: Date;
  duration: number;
  isRepeating: boolean;
  repeatingPattern: RepeatingPattern | null;
  title: string | null;
  description: string | null;
  sequenceId: string;
}
