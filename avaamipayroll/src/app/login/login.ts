import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth'; // 1. Import Firebase Auth

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(Auth); // 2. Inject Auth service

  errorMessage: string | null = null; // To display errors

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  async onLogin() {
    if (this.loginForm.valid) {
      this.errorMessage = null; // Clear old errors
      const email = this.loginForm.value.email!;
      const password = this.loginForm.value.password!;

      try {
        // 3. Attempt real Firebase login
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        console.log('User logged in successfully:', userCredential.user);
        
        // 4. Redirect to employee list or dashboard
        this.router.navigate(['/employees']); 
      } catch (error: any) {
        console.error('Login Error:', error.code);
        // 5. Map Firebase error codes to readable messages
        this.handleAuthError(error.code);
      }
    }
  }

  private handleAuthError(code: string) {
    switch (code) {
      case 'auth/invalid-credential':
        this.errorMessage = 'The email or password you entered is incorrect.';
        break;
      case 'auth/user-not-found':
        this.errorMessage = 'No account exists with this email.';
        break;
      case 'auth/wrong-password':
        this.errorMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/too-many-requests':
        this.errorMessage = 'Too many failed attempts. Try again later.';
        break;
      default:
        this.errorMessage = 'An unexpected error occurred. Please try again.';
    }
  }
}