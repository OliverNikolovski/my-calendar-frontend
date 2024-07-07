import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {MatRadioModule} from "@angular/material/radio";
import {DeletionType} from "../../configs/deletion-type.enum";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  standalone: true,
  templateUrl: 'delete-event.dialog.html',
  styleUrl: 'delete-event.dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatRadioModule, MatButtonModule, FormsModule]
})
export class DeleteEventDialog {
  readonly #matDialogRef = inject(MatDialogRef);

  protected selectedDeletionType = DeletionType.THIS_EVENT;
  protected readonly DeletionType = DeletionType;

  onCancel() {
    this.#matDialogRef.close(null);
  }

  onConfirm() {
    this.#matDialogRef.close(this.selectedDeletionType);
  }
}
