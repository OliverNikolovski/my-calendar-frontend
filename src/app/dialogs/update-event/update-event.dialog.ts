import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {MatRadioModule} from "@angular/material/radio";
import {ActionType} from "../../configs/deletion-type.enum";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NgxMatTimepickerModule} from "ngx-mat-timepicker";
import {MatFormField, MatInput} from "@angular/material/input";
import {calculateDurationInMinutes, calculateNewTime, getHoursAndMinutesFromDateString} from "../../util/date-utils";
import { format, parse } from "date-fns";

@Component({
    templateUrl: 'update-event.dialog.html',
    styleUrl: 'update-event.dialog.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatRadioModule, MatButtonModule, FormsModule, NgxMatTimepickerModule, MatInput, MatFormField]
})
export class UpdateEventDialog {
  readonly #matDialogRef = inject(MatDialogRef);
  protected readonly data: {
    instanceDate: string;
    duration: number;
  } = inject(MAT_DIALOG_DATA);

  protected selectedActionType = ActionType.THIS_EVENT;
  protected newStartTime = this.formatTime(getHoursAndMinutesFromDateString(this.data.instanceDate));
  protected newDuration = this.data.duration;
  protected newEndTime = calculateNewTime(this.newStartTime, this.newDuration);
  protected readonly ActionType = ActionType;
  #pristine = true;

  onCancel() {
    this.#matDialogRef.close(null);
  }

  onConfirm() {
    this.#matDialogRef.close({
      actionType: this.selectedActionType,
      newStartDate: this.newStartDate,
      newDuration: this.newDuration
    });
  }

  onStartTimeChange(time: string) {
    this.newStartTime = time;
    this.newDuration = calculateDurationInMinutes(this.newStartTime, this.newEndTime);
    this.#pristine = false;
  }

  onEndTimeChange(time: string) {
    this.newEndTime = time;
    this.newDuration = calculateDurationInMinutes(this.newStartTime, this.newEndTime);
    this.#pristine = false;
  }

  onDurationChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.newDuration = +inputElement.value;
    this.newEndTime = calculateNewTime(this.newStartTime, this.newDuration);
    this.#pristine = false;
  }

  private formatTime({hours, minutes, period}: {hours: number, minutes: number, period: string}): string {
    return `${hours}:${(minutes).toString().padStart(2, '0')} ${period}`;
  }

  private getHoursAndMinutesFrom12HTimeString(time: string): { hours: number, minutes: number } {
    const [hoursStr, minutesStr, period] = time.split(/[:\s]/);
    const hours = +hoursStr;
    const minutes = +minutesStr;
    let hoursIn24hFormat: number;
    if (period.toUpperCase() === 'AM') {
      if (hours === 12) {
        hoursIn24hFormat = 0;
      } else {
        hoursIn24hFormat = hours;
      }
    } else {
      if (hours === 12) {
        hoursIn24hFormat = 12;
      } else {
        hoursIn24hFormat = hours + 12;
      }
    }
    return {
      hours: hoursIn24hFormat,
      minutes
    }
  }

  get newStartDate(): string {
    console.log('newStartTime',this.newStartTime);
    console.log('instanceDate',this.data.instanceDate);
    const { hours, minutes } = this.getHoursAndMinutesFrom12HTimeString(this.newStartTime);
    const hoursMinutesStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    //return parse(this.newStartTime, 'h:mm a', this.data.instanceDate);
    return this.data.instanceDate.replace(/\d{2}:\d{2}/, hoursMinutesStr);
  }

  get disabled(): boolean {
    return this.newDuration < 15 || this.#pristine;
  }
}
