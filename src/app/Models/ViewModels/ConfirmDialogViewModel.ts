export interface ConfirmDialogViewModel {
  title: string;
  beschreibung: string;
  onConfirmClicked: (id?: number) => void;
  onCancelClicked: () => void;
}
