import {ChangeDetectionStrategy, Component, inject, Signal} from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, distinctUntilChanged, filter, Observable, startWith, switchMap, tap} from "rxjs";
import {SelectOption} from "../../interfaces/select-option";
import {UserService} from "../../services/user.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  templateUrl: 'share-event.dialog.html',
  styleUrl: 'share-event.dialog.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule
  ]
})
export class ShareEventDialog {
  readonly #userService = inject(UserService);
  readonly #matDialogRef = inject(MatDialogRef);

  readonly N = 4;
  myControl = new FormControl('');
  filteredOptions: Signal<SelectOption[] | undefined>;

  constructor() {
    this.filteredOptions = toSignal(
      this.myControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(searchTerm => searchTerm != null && searchTerm.length > 1),
        switchMap(searchTerm => this.#userService.findFirstNMatches(this.N, searchTerm!!))
      )
    )
  }

  onSubmit() {
    this.#matDialogRef.close(this.myControl.value);
  }

  onCancel() {
    this.#matDialogRef.close(null);
  }

  displayUserOption(option: SelectOption): string {
    return option && option.name ? option.name.toString() : '';
  }
}
