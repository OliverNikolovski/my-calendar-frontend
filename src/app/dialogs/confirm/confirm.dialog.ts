import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

@Component({
    templateUrl: 'confirm.dialog.html',
    styleUrl: 'confirm.dialog.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatButton
    ]
})
export class ConfirmDialog {
  readonly #matDialogRef = inject(MatDialogRef);
  protected readonly data: {
    confirmationMessage: string
  } = inject(MAT_DIALOG_DATA);

  onConfirm() {
    this.#matDialogRef.close(true);
  }

  onCancel() {
    this.#matDialogRef.close(false);
  }

}
