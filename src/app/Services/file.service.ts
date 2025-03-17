import {Injectable} from '@angular/core';
import {IAnforderung} from '../Models/Interfaces/IAnforderung';
import {TaskZustand} from '../Models/Enums/TaskZustand';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  fileName: string = 'savedText.txt';
  userLocalTestData = false;
  doDownloads = false;

  constructor() {

  }

  loadData(): IAnforderung[] {
    if(this.doDownloads) {
      if (this.userLocalTestData) {
        return this.getLocalTestData();
      }
      try {
        let savedText = localStorage.getItem('savedText');
        if (savedText) {
          return JSON.parse(savedText);
        }
      } catch (e) {
        console.error('Fehler beim laden aus localStorage:', e);
      }
      return [];
    } else {
      return this.getLocalTestData();
    }
  }

  saveData(data: IAnforderung[]) {
    if(this.doDownloads) {
      const blob = new Blob([JSON.stringify(data)], {type: 'text/plain'});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.fileName;
      a.click();
      window.URL.revokeObjectURL(url);

      try {
        localStorage.setItem('savedText', JSON.stringify(data));
      } catch (e) {
        console.error('Fehler beim Speichern in localStorage:', e);
      }
    }
  }

  private getLocalTestData() {
    return [
      {
        id: 1,
        data: {
          title: "Neue Webseite erstellen",
          beschreibung: "Eine moderne Webseite für das Unternehmen gestalten",
          tasks: [
            {
              id: 1,
              data: {
                title: "Design entwerfen",
                mitarbeiter: "Anna Müller",
                zustand: TaskZustand.todo
              }
            },
            {
              id: 2,
              data: {
                title: "Inhalte schreiben",
                mitarbeiter: "Max Schmidt",
                zustand: TaskZustand.inProgress
              }
            }
          ]
        }
      },
      {
        id: 2,
        data: {
          title: "App-Entwicklung",
          beschreibung: "Eine mobile App für iOS und Android entwickeln",
          tasks: [
            {
              id: 3,
              data: {
                title: "API-Schnittstelle implementieren",
                mitarbeiter: "Lisa Weber",
                zustand: TaskZustand.done
              }
            },
            {
              id: 4,
              data: {
                title: "UI-Design umsetzen",
                mitarbeiter: "Tom Berger",
                zustand: TaskZustand.todo
              }
            },
            {
              id: 5,
              data: {
                title: "Beta-Test durchführen",
                mitarbeiter: "Chris Bauer",
                zustand: TaskZustand.inProgress
              }
            }
          ]
        }
      },
      {
        id: 3,
        data: {
          title: "Marketingkampagne planen",
          beschreibung: "Eine neue Social-Media-Kampagne vorbereiten",
          tasks: [
            {
              id: 6,
              data: {
                title: "Zielgruppenanalyse",
                mitarbeiter: "Julia Wagner",
                zustand: TaskZustand.done
              }
            },
            {
              id: 7,
              data: {
                title: "Content erstellen",
                mitarbeiter: "Daniel Schmidt",
                zustand: TaskZustand.todo
              }
            }
          ]
        }
      },
      {
        id: 4,
        data: {
          title: "Interne IT-Optimierung",
          beschreibung: "Die internen Systeme auf den neuesten Stand bringen",
          tasks: [
            {
              id: 8,
              data: {
                title: "Server-Update planen",
                mitarbeiter: "Stefan Maier",
                zustand: TaskZustand.inProgress
              }
            },
            {
              id: 9,
              data: {
                title: "Backup-Strategie überarbeiten",
                mitarbeiter: "Nina Hoffmann",
                zustand: TaskZustand.done
              }
            },
            {
              id: 10,
              data: {
                title: "Security-Audit durchführen",
                mitarbeiter: "Jan Lehmann",
                zustand: TaskZustand.todo
              }
            }
          ]
        }
      },
      {
        id: 5,
        data: {
          title: "Kundenportal erweitern",
          beschreibung: "Neue Funktionen für das Kundenportal hinzufügen",
          tasks: []
        }
      }
    ];
  }
}
