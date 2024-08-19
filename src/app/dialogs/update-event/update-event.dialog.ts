import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {MatRadioModule} from "@angular/material/radio";
import {ActionType} from "../../configs/deletion-type.enum";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NgxMatTimepickerModule} from "ngx-mat-timepicker";
import {MatFormField, MatInput} from "@angular/material/input";
import {calculateDurationInMinutes, calculateNewTime} from "../../util/date-utils";
import { format, parse } from "date-fns";

@Component({
  standalone: true,
  templateUrl: 'update-event.dialog.html',
  styleUrl: 'update-event.dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatRadioModule, MatButtonModule, FormsModule, NgxMatTimepickerModule, MatInput, MatFormField]
})
export class UpdateEventDialog {
  readonly #matDialogRef = inject(MatDialogRef);
  protected readonly data: {
    instanceDate: Date;
    duration: number;
  } = inject(MAT_DIALOG_DATA);

  protected selectedActionType = ActionType.THIS_EVENT;
  protected newStartTime = format(this.data.instanceDate, 'h:mm a');
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

  get newStartDate(): Date {
    return parse(this.newStartTime, 'h:mm a', this.data.instanceDate);
  }

  get disabled(): boolean {
    return this.newDuration < 15 || this.#pristine;
  }
}
