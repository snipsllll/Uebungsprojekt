import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

// Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyBASrddyr2HHBTkga4Dsjk8yED29gptvec",
  authDomain: "uebungsprojekt-52c2a.firebaseapp.com",
  projectId: "uebungsprojekt-52c2a",
  storageBucket: "uebungsprojekt-52c2a.appspot.com",
  messagingSenderId: "1013875983053",
  appId: "1:1013875983053:web:4190360a80226652449f84"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()) // 🔥 Firestore als Provider hinzufügen
  ]
};
