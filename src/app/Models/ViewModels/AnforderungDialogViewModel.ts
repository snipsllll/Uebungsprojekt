import {IAnforderung} from "../Interfaces/IAnforderung";

export interface AnforderungDialogViewModel {
  anforderung?: IAnforderung;
  onSaveClick: (anforderung: IAnforderung) => void;
  onCancelClick: () => void;
}
