import {RepeatingPattern} from "./repeating-pattern";

export interface CalendarEvent {
  id: number;
  startDate: string;
  duration: number;
  isRepeating: boolean;
  repeatingPattern: RepeatingPattern | null;
  title: string | null;
  description: string | null;
  sequenceId: string;
  isPublic: boolean;
  minutes: number | null;
}
