import { Injectable } from '@angular/core';
import { IAnforderung } from '../Models/Interfaces/IAnforderung';
import { IFireData } from '../Models/Interfaces/IFireData';
import { Firestore, collection, doc, getDocs, updateDoc, setDoc } from '@angular/fire/firestore';

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
      return data.anforderungen as IAnforderung[];
    } catch (error) {
      console.error(`Error while downloading data from server!`, error);
      return [];
    }
  }
}
