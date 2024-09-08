import {ActionType} from "../../configs/deletion-type.enum";

export interface CalendarEventUpdateRequest {
  eventId: number;
  fromDate: string;
  actionType: ActionType;
  newStartDate: Date;
  newDuration: number;
  order: number;
}
