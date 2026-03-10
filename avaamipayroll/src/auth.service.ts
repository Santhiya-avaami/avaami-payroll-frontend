import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updateProfile, user } from '@angular/fire/auth';
import { Firestore, doc, setDoc, serverTimestamp } from '@angular/fire/firestore'; // Added Firestore imports
import { from, Observable, switchMap, firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore); // Inject Firestore

  signUp(email: string, password: string, displayName: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (response) => {
        const user = response.user;

        // 1. Update the Auth Profile (for immediate UI usage)
        await updateProfile(user, { displayName });

        // 2. Create the Firestore Document reference
        // We use the UID from Auth as the Document ID in the 'users' collection
        const userDocRef = doc(this.firestore, `users/${user.uid}`);

        // 3. Save the user data to Firestore
        return setDoc(userDocRef, {
          uid: user.uid,
          displayName: displayName,
          email: email,
          role: 'user', // Default role
          createdAt: serverTimestamp(), // Uses Firebase server time
        });
      });

    return from(promise);
  }
  async getIdToken(): Promise<string> {
    // Get the current user observable and take the first value
    const currentUser = await firstValueFrom(user(this.auth));
    
    if (currentUser) {
      // Force refresh the token to ensure it's valid
      return await currentUser.getIdToken(true);
    }
    return '';
  }
}