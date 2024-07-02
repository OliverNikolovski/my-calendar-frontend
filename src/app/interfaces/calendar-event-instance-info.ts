import {CalendarEvent} from "./calendar-event";

export interface CalendarEventInstanceInfo {
  eventId: number;
  date: string;
  duration: number;
  event: CalendarEvent
}
