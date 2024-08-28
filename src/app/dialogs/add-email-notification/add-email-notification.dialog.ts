import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";

@Component({
  standalone: true,
  templateUrl: 'add-email-notification.dialog.html',
  styleUrl: 'add-email-notification.dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButton,
    MatInput,
    FormsModule
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
