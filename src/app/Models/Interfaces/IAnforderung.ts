import {ITask} from "./ITask";

export interface IAnforderung {
  id: number;
  data: IAnforderungData;
}

export interface IAnforderungData {
  title: string;
  beschreibung?: string;
  tasks: ITask[];
}
