import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {MatRadioModule} from "@angular/material/radio";
import {ActionType} from "../../configs/deletion-type.enum";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  standalone: true,
  templateUrl: 'update-event.dialog.html',
  styleUrl: 'update-event.dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatRadioModule, MatButtonModule, FormsModule]
})
export class UpdateEventDialog {
  readonly #matDialogRef = inject(MatDialogRef);

  protected selectedActionType = ActionType.THIS_EVENT;
  protected readonly ActionType = ActionType;

  onCancel() {
    this.#matDialogRef.close(null);
  }

  onConfirm() {
    this.#matDialogRef.close(this.selectedActionType);
  }
}
