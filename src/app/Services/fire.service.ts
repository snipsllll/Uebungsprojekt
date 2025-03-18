import { Injectable } from '@angular/core';
import { IAnforderung } from '../Models/Interfaces/IAnforderung';
import { IFireData } from '../Models/Interfaces/IFireData';
import { Firestore, collection, doc, getDocs, updateDoc, setDoc } from '@angular/fire/firestore';
import {TaskZustand} from '../Models/Enums/TaskZustand';
import {ITask} from '../Models/Interfaces/ITask';

@Injectable({
  providedIn: 'root'
})
export class FireService {
  constructor(private firestore: Firestore) { }

  async saveDataOnServer(dataToAdd: IAnforderung[]): Promise<void> {
    console.log("...saving data on server");
    const collectionRef = collection(this.firestore, `data`);

    try {
      // 1. Bestehende Dokumente abrufen
      const querySnapshot = await getDocs(collectionRef);

      if (!querySnapshot.empty) {
        // 2. Erstes vorhandenes Dokument nehmen
        const firstDoc = querySnapshot.docs[0];
        const docRef = doc(this.firestore, `data/${firstDoc.id}`);

        // 3. Dokument mit neuen Daten aktualisieren
        await updateDoc(docRef, { anforderungen: dataToAdd });
        console.log('Successfully updated existing data on server.');
      } else {
        // 4. Falls kein Dokument existiert, ein neues erstellen
        const newDocRef = doc(this.firestore, `data/newEntry`);
        await setDoc(newDocRef, { anforderungen: dataToAdd });
        console.log('No existing data found, created new entry.');
      }
    } catch (error) {
      console.error('Error while saving data on server:', error);
    }
  }

  async getDataFromServer(): Promise<IAnforderung[]> {
    console.log("...downloading fireData")

    const collectionRef = collection(this.firestore, `data`);
    try {
      const querySnapshot = await getDocs(collectionRef);
      if (querySnapshot.empty) {
        console.warn(`No entries was found on server! Creating new Data!`);
        return [];
      }
      const docSnap = querySnapshot.docs[0];
      console.log('Successfully downloaded fireData.')
      const data = docSnap.data() as IFireData;
      //return this.getLocalTestData();
      return data.anforderungen as IAnforderung[];
    } catch (error) {
      console.error(`Error while downloading data from server!`, error);
      return [];
    }
  }

  private getLocalTestData() {
    let tasks: ITask[] = [];
    for(let i=20;i<=220;i++){
      tasks.push({
        id: i,
        data: {
          title: "MIAU",
          mitarbeiter: "David",
          zustand: TaskZustand.todo
        }
      })
    }
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
          title: "MIAUUUUUUUU",
          beschreibung: "Noah braucht mehr MIAU's in seiner Fresse!",
          tasks: tasks
        }
      }
    ];
  }
}
