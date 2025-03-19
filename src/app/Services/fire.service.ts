import {Injectable} from '@angular/core';
import {IAnforderung} from '../Models/Interfaces/IAnforderung';
import {IFireData} from '../Models/Interfaces/IFireData';
import {collection, doc, Firestore, getDocs, setDoc, updateDoc} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FireService {
  constructor(private firestore: Firestore) { }

  async saveDataOnServer(dataToAdd: IAnforderung[], override?: boolean): Promise<void> {
    console.log(dataToAdd)
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
}
