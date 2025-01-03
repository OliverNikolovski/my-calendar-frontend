import {RepeatingPattern} from "../repeating-pattern";

export interface CalendarEventCreateRequest {
  startDate: string;
  duration: number;
  isRepeating: boolean;
  repeatingPattern?: RepeatingPattern;
  title?: string;
  description?: string;
  minutes: number | null;
}
