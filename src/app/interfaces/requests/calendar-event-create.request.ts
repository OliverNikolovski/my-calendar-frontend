import {RepeatingPattern} from "../repeating-pattern";

export interface CalendarEventCreateRequest {
  startDate: Date;
  duration: number;
  endDate?: Date;
  isRepeating: boolean;
  recurrenceRule?: RepeatingPattern;
  title?: string;
  description?: string;
}
