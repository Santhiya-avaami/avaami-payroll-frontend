import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee';
import { AuthService } from '../../../auth.service';
import { Router } from '@angular/router'; // Added Router import

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-employee.html',
  styleUrls: ['./add-employee.css']
})
export class AddEmployeeComponent {
  showSuccessPopup = false;
  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router // Added Router injection
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      designation: ['', Validators.required],
      joining_date: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.authService.getIdToken().then(token => {
        this.employeeService.addEmployee(this.employeeForm.value, token).subscribe({
          next: (response) => {
            this.showSuccessPopup = true; // Show the custom popup
            this.employeeForm.reset();
            console.log('Employee added successfully:', response);
          },
          error: (error) => {
            console.error('Error adding employee:', error);
            alert('Failed to add employee. Please check your connection.');
          }
        });
      });
    }
  }

  closePopup() {
    this.showSuccessPopup = false;
    this.router.navigate(['/employees']); // Redirect to the list
  }
}