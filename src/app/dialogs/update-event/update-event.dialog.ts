import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from "@angular/core";
import {MatRadioModule} from "@angular/material/radio";
import {ActionType} from "../../configs/deletion-type.enum";
import {MatButtonModule} from "@angular/material/button";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {addMinutes, differenceInMinutes} from "date-fns";
import {MatTimepickerModule} from "@angular/material/timepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {provideNativeDateAdapter} from "@angular/material/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AddEmailNotificationComponent} from "../../components/add-email-notification/add-email-notification.component";
import {MatCheckbox} from "@angular/material/checkbox";

@Component({
  templateUrl: 'update-event.dialog.html',
  styleUrl: 'update-event.dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
  imports: [MatRadioModule, MatButtonModule, FormsModule, MatInputModule, MatFormFieldModule, MatTimepickerModule, ReactiveFormsModule, AddEmailNotificationComponent, MatCheckbox]
})
export class UpdateEventDialog implements OnInit {
  readonly #matDialogRef = inject(MatDialogRef);
  readonly #fb = inject(FormBuilder);
  readonly #destroyRef = inject(DestroyRef);

  protected readonly data: {
    instanceDate: string;
    duration: number;
    minutes?: number | null;
  } = inject(MAT_DIALOG_DATA);
  protected readonly ActionType = ActionType;
  protected form = this.#fb.nonNullable.group({
    startTime: [new Date(this.data.instanceDate), Validators.required],
    endTime: [addMinutes(this.data.instanceDate, this.data.duration), Validators.required],
    duration: [this.data.duration, [Validators.required, Validators.min(15)]],
    actionType: [ActionType.THIS_EVENT, Validators.required],
    minutes: [this.data.minutes]
  });
  protected showAddNotification = this.data.minutes != null;

  ngOnInit() {
    console.log('data', this.data);
    this.startTimeControl.valueChanges
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(newStartTime =>
        this.durationControl.setValue(differenceInMinutes(this.endTimeControl.value, newStartTime), {emitEvent: false}));
    this.endTimeControl.valueChanges
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(newEndTime =>
        this.durationControl.setValue(differenceInMinutes(newEndTime, this.startTimeControl.value), {emitEvent: false}));
    this.durationControl.valueChanges
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(newDuration =>
        this.endTimeControl.setValue(addMinutes(this.startTimeControl.value, newDuration), {emitEvent: false}));
  }

  onCancel() {
    this.#matDialogRef.close(null);
  }

  onConfirm() {
    const value =
      this.showAddNotification ? this.form.value : { ...this.form.value, minutes: null };
    this.#matDialogRef.close(value as UpdateEventType);
  }

  get startTimeControl(): FormControl<Date> {
    return this.form.get('startTime') as FormControl;
  }

  get endTimeControl(): FormControl<Date> {
    return this.form.get('endTime') as FormControl;
  }

  get durationControl(): FormControl<number> {
    return this.form.get('duration') as FormControl;
  }
}

export type UpdateEventType = {
  startTime: Date;
  endTime: Date;
  duration: number;
  actionType: ActionType;
  minutes: number | null;
};
