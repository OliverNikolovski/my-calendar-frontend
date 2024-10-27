import {ActionType} from "../../configs/deletion-type.enum";

export interface CalendarEventUpdateRequest {
  eventId: number;
  fromDate: string;
  actionType: ActionType;
  newStartDate: string;
  newDuration: number;
  order: number;
}
