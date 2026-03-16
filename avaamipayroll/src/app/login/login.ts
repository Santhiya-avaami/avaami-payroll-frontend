import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { AuthService } from '../../auth.service'; // Ensure this path is correct

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
  private auth = inject(Auth);
  private authService = inject(AuthService); // Inject your custom service

  errorMessage: string | null = null;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  async onLogin() {
    if (this.loginForm.valid) {
      this.errorMessage = null;
      const email = this.loginForm.value.email!;
      const password = this.loginForm.value.password!;

      try {
        // Step 1: Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        console.log('Firebase login success:', userCredential.user.email);

        // Step 2: Get the Token
        const token = await this.authService.getIdToken();

        // Step 3: Get Role from Django and Redirect
        this.authService.getUserProfile(token).subscribe({
          next: (profile) => {
            console.log('Django Profile Loaded:', profile);
            
            if (profile.role === 'admin') {
              this.router.navigate(['/employees']); // Admins go to Employee List
            } else {
              this.router.navigate(['/employee-dashboard']); // Employees like Bubu go here
            }
          },
          error: (err) => {
            console.error('Django Profile Error:', err);
            this.errorMessage = 'Account authenticated but profile not found in Payroll system.';
          }
        });

      } catch (error: any) {
        console.error('Login Error:', error.code);
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
      case 'auth/too-many-requests':
        this.errorMessage = 'Too many failed attempts. Try again later.';
        break;
      default:
        this.errorMessage = 'Login failed. Please try again.';
    }
  }
}