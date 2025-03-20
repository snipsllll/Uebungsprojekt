import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

// Firebase-Konfiguration
const firebaseConfigProduction = {
  apiKey: "AIzaSyDZvjeHdVKyWw6CPqu7x-MwM-lho3Fqx7s",
  authDomain: "uebungsprojekt-deployed.firebaseapp.com",
  projectId: "uebungsprojekt-deployed",
  storageBucket: "uebungsprojekt-deployed.firebasestorage.app",
  messagingSenderId: "401943165348",
  appId: "1:401943165348:web:8685df2fb8fe2cce46a931"
};

const firebaseConfigDevelop = {
  apiKey: "AIzaSyBASrddyr2HHBTkga4Dsjk8yED29gptvec",
  authDomain: "uebungsprojekt-52c2a.firebaseapp.com",
  projectId: "uebungsprojekt-52c2a",
  storageBucket: "uebungsprojekt-52c2a.appspot.com",
  messagingSenderId: "1013875983053",
  appId: "1:1013875983053:web:4190360a80226652449f84"
};

const develop = false;

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideFirebaseApp(() => initializeApp(develop ? firebaseConfigDevelop : firebaseConfigProduction)),
    provideFirestore(() => getFirestore()) // 🔥 Firestore als Provider hinzufügen
  ]
};
