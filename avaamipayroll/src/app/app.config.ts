import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// 1. Add getApp to this import line
import { initializeApp, provideFirebaseApp, getApp } from '@angular/fire/app'; 
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from '../app/environments/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    // Now getApp() will be recognized
    provideFirestore(() => getFirestore(getApp(), 'payroll')), 
    provideHttpClient()
  ]
};