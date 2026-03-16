import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updateProfile, user } from '@angular/fire/auth';
import { Firestore, doc, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { from, Observable, switchMap, firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private http = inject(HttpClient);

  private djangoApiUrl = 'http://127.0.0.1:8000/api/register-company/';

  signUp(email: string, password: string, displayName: string, role: string, extraData: any): Observable<any> {
    const firebasePromise = createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (response) => {
        const userInstance = response.user;
        await updateProfile(userInstance, { displayName });

        const userDocRef = doc(this.firestore, `users/${userInstance.uid}`);
        await setDoc(userDocRef, {
          uid: userInstance.uid,
          displayName,
          email,
          role,
          ...extraData,
          createdAt: serverTimestamp(),
        });

        return {
          firebase_uid: userInstance.uid,
          email,
          username: displayName,
          role,
          ...extraData
        };
      });

    return from(firebasePromise).pipe(
      switchMap(payload => this.http.post(this.djangoApiUrl, payload))
    );
  }

  /**
   * FIX: Added/Verified getIdToken method
   */
  async getIdToken(): Promise<string> {
    // This gets the currently logged in user from Firebase
    const currentUser = this.auth.currentUser;
    
    if (currentUser) {
      // Force refresh ensures we have the latest token
      return await currentUser.getIdToken(true);
    }
    return '';
  }
  getUserProfile(token: string): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get('http://127.0.0.1:8000/api/user-profile/', { headers });
}
}