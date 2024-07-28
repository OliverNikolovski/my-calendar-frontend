import {ActionType} from "../../configs/deletion-type.enum";

export interface CalendarEventUpdateRequest {
  eventId: number;
  fromDate: string;
  actionType: ActionType;
  newStartTime: string;
  newDuration: number;
}
