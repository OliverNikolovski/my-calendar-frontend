import {ChangeDetectionStrategy, Component, inject, signal} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {AddEmailNotificationComponent} from "../../components/add-email-notification/add-email-notification.component";
import {EqualPipe} from "../../pipes/equal.pipe";

@Component({
  templateUrl: 'add-email-notification.dialog.html',
  styleUrl: 'add-email-notification.dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButton,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    AddEmailNotificationComponent,
    EqualPipe
  ]
})
export class AddEmailNotificationDialog {
  readonly #matDialogRef = inject(MatDialogRef);
  readonly data: { minutes: number | null } = inject(MAT_DIALOG_DATA);
  protected minutes: number | null = this.data.minutes;

  onSave() {
    this.#matDialogRef.close(this.minutes);
  }

  onCancel() {
    this.#matDialogRef.close(null);
  }
}
