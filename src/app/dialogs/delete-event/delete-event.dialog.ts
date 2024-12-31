import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {MatRadioModule} from "@angular/material/radio";
import {ActionType} from "../../configs/deletion-type.enum";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
    templateUrl: 'delete-event.dialog.html',
    styleUrl: 'delete-event.dialog.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatRadioModule, MatButtonModule, FormsModule]
})
export class DeleteEventDialog {
  readonly #matDialogRef = inject(MatDialogRef);

  protected selectedDeletionType = ActionType.THIS_EVENT;
  protected readonly DeletionType = ActionType;

  onCancel() {
    this.#matDialogRef.close(null);
  }

  onConfirm() {
    this.#matDialogRef.close(this.selectedDeletionType);
  }
}
