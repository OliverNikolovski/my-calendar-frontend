import {ActionType} from "../../configs/deletion-type.enum";

export interface CalendarEventUpdateRequest {
  eventId: number;
  fromDate: string;
  actionType: ActionType;
  startTime: string;
  duration: number;
  order: number;
  minutes: number | null;
}
