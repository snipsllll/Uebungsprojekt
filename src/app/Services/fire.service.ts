import {Injectable} from '@angular/core';
import {IAnforderung} from '../Models/Interfaces/IAnforderung';
import {IFireData} from '../Models/Interfaces/IFireData';
import {collection, doc, Firestore, getDocs, setDoc, updateDoc} from '@angular/fire/firestore';
import {TaskZustand} from '../Models/Enums/TaskZustand';

@Injectable({
  providedIn: 'root'
})
export class FireService {
  constructor(private firestore: Firestore) { }

  async saveDataOnServer(dataToAdd: IAnforderung[], override?: boolean): Promise<void> {
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
        if(override !== true) {
          await updateDoc(docRef, { anforderungen: dataToAdd });
        } else {
          await setDoc(docRef, { anforderungen: dataToAdd });
        }

        console.log('Successfully updated existing data on server.');
      } else {
        // 4. Falls kein Dokument existiert, ein neues erstellen
        const newDocRef = doc(this.firestore, `data/newEntry`);
        await setDoc(newDocRef, { anforderungen: dataToAdd });
      }
    } catch (error) {
      console.error('Error while saving data on server:', error);
    }
  }

  async getDataFromServer(): Promise<IAnforderung[]> {
    //return this.generateAnforderungen(0, 0);
    console.log("...downloading fireData")

    const collectionRef = collection(this.firestore, `data`);
    try {
      const querySnapshot = await getDocs(collectionRef);
      if (querySnapshot.empty) {
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

  generateAnforderungen(anzahlAnforderungen: number, anzahlTasksIngesamt: number) {
    const anforderungen = [];
    let taskIdCounter = 1; // ID für Tasks

    const beispielTitel = ["MIAU sagen", "Nochmal MIAU sagen"];
    const beispielBeschreibungen = ["Noah braucht mehr MIAU's in seiner Fresse!"
    ];
    const beispielTasks = ["MIAU", "miau", "MIAAAAAAAUUUUUU!!!!", "MEOW^-^", "MIAUU","MIIIAUUUU","miauuu","meow","meoooow","MIAU", "miau", "MIAAAAAAAUUUUUU!!!!", "MEOW^-^", "MIAUU","MIIIAUUUU","miauuu","meow","meoooow","MIAU", "miau", "MIAAAAAAAUUUUUU!!!!", "MEOW^-^", "MIAUU","MIIIAUUUU","miauuu","meow","meoooow","MIAU", "miau", "MIAAAAAAAUUUUUU!!!!", "MEOW^-^", "MIAUU","MIIIAUUUU","miauuu","meow","meoooow","MIAU", "miau", "MIAAAAAAAUUUUUU!!!!", "MEOW^-^", "MIAUU","MIIIAUUUU","miauuu","meow","meoooow","MIAU", "miau", "MIAAAAAAAUUUUUU!!!!", "MEOW^-^", "MIAUU","MIIIAUUUU","miauuu","meow","meoooow","MIAU", "miau", "MIAAAAAAAUUUUUU!!!!", "MEOW^-^", "MIAUU","MIIIAUUUU","miauuu","meow","meoooow","MIAU", "miau", "MIAAAAAAAUUUUUU!!!!", "MEOW^-^", "MIAUU","MIIIAUUUU","miauuu","meow","meoooow","MIAU", "miau", "MIAAAAAAAUUUUUU!!!!", "MEOW^-^", "MIAUU","MIIIAUUUU","miauuu","meow","meoooow","MIAU", "miau", "MIAAAAAAAUUUUUU!!!!", "MEOW^-^", "MIAUU","MIIIAUUUU","miauuu","meow","meoooow","MIAU", "miau", "MIAAAAAAAUUUUUU!!!!", "MEOW^-^", "MIAUU","MIIIAUUUU","miauuu","meow","meoooow","MIAU", "miau", "MIAAAAAAAUUUUUU!!!!", "MEOW^-^", "MIAUU","MIIIAUUUU","miauuu","meow","meoooow","MIAU", "miau", "MIAAAAAAAUUUUUU!!!!", "MEOW^-^", "MIAUU","MIIIAUUUU","miauuu","meow","meoooow","MIAU", "miau", "MIAAAAAAAUUUUUU!!!!", "MEOW^-^", "MIAUU","MIIIAUUUU","miauuu","meow","meoooow","MIAU", "miau", "MIAAAAAAAUUUUUU!!!!", "MEOW^-^", "MIAUU","MIIIAUUUU","miauuu","meow","meoooow","MIAU", "miau", "MIAAAAAAAUUUUUU!!!!", "MEOW^-^", "MIAUU","MIIIAUUUU","miauuu","meow","meoooow","MIAU", "miau", "MIAAAAAAAUUUUUU!!!!", "MEOW^-^", "MIAUU","MIIIAUUUU","miauuu","meow","meoooow","MIAU", "miau", "MIAAAAAAAUUUUUU!!!!", "MEOW^-^", "MIAUU","MIIIAUUUU","miauuu","meow","meoooow","MIAU", "miau", "MIAAAAAAAUUUUUU!!!!", "MEOW^-^", "MIAUU","MIIIAUUUU","miauuu","meow","meoooow","MIAU", "miau", "MIAAAAAAAUUUUUU!!!!", "MEOW^-^", "MIAUU","MIIIAUUUU","miauuu","meow","meoooow","muhhhh"];
    const beispielMitarbeiter = ["David"];

    // 1. Anforderungen erstellen
    for (let i = 0; i < anzahlAnforderungen; i++) {
      const anforderung = {
        id: i + 1,
        data: {
          title: beispielTitel[i % beispielTitel.length], // Titel aus Liste rotieren
          beschreibung: beispielBeschreibungen[i % beispielBeschreibungen.length], // Beschreibung aus Liste rotieren
          tasks: []
        }
      };

      anforderungen.push(anforderung);
    }

    // 2. Tasks gleichmäßig auf die Anforderungen verteilen
    for (let i = 0; i < anzahlTasksIngesamt; i++) {
      const zufallsAnforderung: IAnforderung = anforderungen[Math.floor(Math.random() * anforderungen.length)]; // Zufällige Anforderung
      const task = {
        id: taskIdCounter++,
        data: {
          title: beispielTasks[i % beispielTasks.length], // Zufälliger Task-Titel
          mitarbeiter: beispielMitarbeiter[i % beispielMitarbeiter.length], // Zufälliger Mitarbeiter
          zustand: this.getRandomTaskZustand(), // Jetzt mit richtiger Enum-Zuweisung
          isTitleInEditMode: false
        }
      };

      zufallsAnforderung.data.tasks.push(task);
    }

    return anforderungen;
  }

  /**
   * Wählt ein zufälliges Element aus dem TaskZustand-Enum
   */
  getRandomTaskZustand(): TaskZustand {
    const values = Object.values(TaskZustand).filter(value => typeof value === "number") as TaskZustand[];
    return values[Math.floor(Math.random() * values.length)];
  }
}
