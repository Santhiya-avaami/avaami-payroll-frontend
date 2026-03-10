import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  // Your Django backend URL
  private apiUrl = 'http://127.0.0.1:8000/api/employees/';

  constructor(private http: HttpClient) {}

  // Method to get all employees for the logged-in user's company
  getEmployees(token: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Firebase Token
    });
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // Method to add a new employee
  addEmployee(employeeData: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Firebase Token
    });
    return this.http.post(this.apiUrl, employeeData, { headers });
  }
}