import { Component, OnInit } from '@angular/core'; // 1. Import OnInit
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee'; // 2. Import Service
import { AuthService } from '../../auth.service'; // 3. Import Auth Service
import { RouterModule } from '@angular/router'; // 4. Import for Routing

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, RouterModule], // 5. Add RouterModule
  templateUrl: './employee.html',
  styleUrl: './employee.css',
})
export class EmployeesComponent implements OnInit { // 6. Implement OnInit
  employees: any[] = []; // 7. Change to hold API data

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // 8. Call backend when component loads
    this.loadEmployees();
  }

  loadEmployees() {
    this.authService.getIdToken().then(token => {
      this.employeeService.getEmployees(token).subscribe({
        next: (data) => {
          // 9. Map API data to your table structure
          this.employees = data.map(emp => ({
            id: emp.id,
            name: `${emp.first_name} ${emp.last_name}`,
            role: emp.designation,
            department: 'IT', // Add this to backend later
            status: 'Active'  // Add this to backend later
          }));
        },
        error: (err) => console.error('Error fetching employees', err)
      });
    });
  }
}