import { Component, OnInit } from '@angular/core'; // 1. Import OnInit
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee'; // 2. Import Service
import { AuthService } from '../../auth.service'; // Assuming this exists
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payroll.html',
  styleUrl: './payroll.css',
})
export class PayrollComponent implements OnInit { // 3. Implement OnInit
  currentMonth = "October 2023";
  employees: any[] = []; // 4. Change to hold API data

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // 5. Call backend when component loads
    this.loadEmployees();
  }

  loadEmployees() {
    this.authService.getIdToken().then(token => {
      this.employeeService.getEmployees(token).subscribe({
        next: (data) => {
          this.employees = data; // Set the real data from Django
          console.log('Employees loaded:', data);
        },
        error: (err) => {
          console.error('Error loading employees:', err);
        }
      });
    });
  }

  // Update this to use the structure from API response
  calculateNetPay(basic: number, hra: number, pf: number, tax: number): number {
    return (basic + hra) - (pf + tax);
  }
}