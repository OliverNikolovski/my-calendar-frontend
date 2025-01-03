import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {AddEmailNotificationComponent} from "../../components/add-email-notification/add-email-notification.component";

@Component({
  templateUrl: 'add-email-notification.dialog.html',
  styleUrl: 'add-email-notification.dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButton,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    AddEmailNotificationComponent
  ]
})
export class AddEmailNotificationDialog {
  readonly #matDialogRef = inject(MatDialogRef);

  protected minutes: number | null = null;

  onSave() {
    this.#matDialogRef.close(this.minutes);
  }

  onCancel() {
    this.#matDialogRef.close(null);
  }
}
