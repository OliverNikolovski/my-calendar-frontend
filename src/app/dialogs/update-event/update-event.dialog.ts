import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {MatRadioModule} from "@angular/material/radio";
import {ActionType} from "../../configs/deletion-type.enum";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NgxMatTimepickerModule} from "ngx-mat-timepicker";
import {MatInput} from "@angular/material/input";
import {calculateDurationInMinutes, calculateNewTime} from "../../util/date-utils";

@Component({
  standalone: true,
  templateUrl: 'update-event.dialog.html',
  styleUrl: 'update-event.dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatRadioModule, MatButtonModule, FormsModule, NgxMatTimepickerModule, MatInput]
})
export class UpdateEventDialog {
  readonly #matDialogRef = inject(MatDialogRef);
  protected readonly data: {
    startTime: string; // ex. "9:30 AM"
    duration: number;
  } = inject(MAT_DIALOG_DATA);

  protected selectedActionType = ActionType.THIS_EVENT;
  protected newStartTime = this.data.startTime;
  protected newDuration = this.data.duration;
  protected newEndTime = calculateNewTime(this.newStartTime, this.newDuration);
  protected readonly ActionType = ActionType;
  #pristine = true;

  onCancel() {
    this.#matDialogRef.close(null);
  }

  onConfirm() {
    this.#matDialogRef.close({
      selectedActionType: this.selectedActionType,
      newStartTime: this.newStartTime,
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

  get disabled(): boolean {
    return this.newDuration < 15 || this.#pristine;
  }
}
