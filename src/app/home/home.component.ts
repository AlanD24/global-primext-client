import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';

export interface UserModel {
  id: number;
  name: string;
  paternal_surname: string;
  maternal_surname: string;
  address: String;
  phone: String;
  actions: String;
}

export type SweetAlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question';

const MOCK_DATA: UserModel[] = [
  {id: 1, name: 'Juan', paternal_surname: 'Lopez', maternal_surname: 'Diaz', address: 'First address', phone: '000-123-45678', actions: ''},
  {id: 2, name: 'Dario', paternal_surname: 'Hernandez', maternal_surname: 'Barreto', address: 'Test address', phone: '000-123-45678', actions: ''},
  {id: 3, name: 'Lucas', paternal_surname: 'Flores', maternal_surname: 'Espinoza', address: 'Test address', phone: '000-123-45678', actions: ''},
  {id: 4, name: 'Roberto', paternal_surname: 'Vazquez', maternal_surname: 'Nieto', address: 'Test address', phone: '000-123-45678', actions: ''},
  {id: 5, name: 'Maria', paternal_surname: 'Sanchez', maternal_surname: 'Alonso', address: 'Test address', phone: '000-123-45678', actions: ''},
  {id: 6, name: 'Mercedes', paternal_surname: 'Hills', maternal_surname: 'Lopez', address: 'Test address', phone: '000-123-45678', actions: ''},
  {id: 7, name: 'Regina', paternal_surname: 'Rodriguez', maternal_surname: 'Perez', address: 'Test address', phone: '000-123-45678', actions: ''},
  {id: 8, name: 'William', paternal_surname: 'A', maternal_surname: 'A', address: 'Test address', phone: '000-123-45678', actions: ''},
  {id: 9, name: 'Dafne', paternal_surname: 'B', maternal_surname: 'B', address: 'Test address', phone: '000-123-45678', actions: ''},
  {id: 10, name: 'Natalia', paternal_surname: 'C', maternal_surname: 'C', address: 'Test address', phone: '000-123-45678', actions: ''},
  {id: 11, name: 'Daniela', paternal_surname: 'D', maternal_surname: 'D', address: 'Test address', phone: '000-123-45678', actions: ''},
  {id: 12, name: 'Samanta', paternal_surname: 'E', maternal_surname: 'E', address: 'Test address', phone: '000-123-45678', actions: ''},
  {id: 13, name: 'Arthur', paternal_surname: 'Morgan', maternal_surname: 'Morgan', address: 'Test address', phone: '000-123-45678', actions: ''},
  {id: 14, name: 'Sofia', paternal_surname: 'F', maternal_surname: 'F', address: 'Test address', phone: '000-123-45678', actions: ''},
  {id: 15, name: 'Pablo', paternal_surname: 'G', maternal_surname: 'G', address: 'Test address', phone: '000-123-45678', actions: ''},
  {id: 16, name: 'Marcos', paternal_surname: 'H', maternal_surname: 'H', address: 'Test address', phone: '000-123-45678', actions: ''},
  {id: 17, name: 'Cristian', paternal_surname: 'I', maternal_surname: 'I', address: 'Test address', phone: '000-123-45678', actions: ''},
  {id: 18, name: 'Gabriela', paternal_surname: 'J', maternal_surname: 'J', address: 'Test address', phone: '000-123-45678', actions: ''},
  {id: 19, name: 'Talia', paternal_surname: 'K', maternal_surname: 'K', address: 'Test address', phone: '000-123-45678', actions: ''},
  {id: 20, name: 'Juliet', paternal_surname: 'L', maternal_surname: 'L', address: 'Test address', phone: '000-123-45678', actions: ''},
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  protected title: string = 'Global Primex T users';

  protected displayedColumns: string[] = ['id', 'name', 'paternal_surname', 'maternal_surname', 'address', 'phone', 'actions'];
  protected dataSource = new MatTableDataSource<UserModel>();
  private users: UserModel[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private userServ: UserService,
    private dialog: MatDialog
  ) {
    this.getUsersList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  private getUsersList(): void {
    this.userServ.getUsers().subscribe({
      next: response => {
        // If success, fill table with backend results
        this.dataSource = new MatTableDataSource<UserModel>(response.data);
        this.users = response.data;
      },
      error: error => {
        console.error(error);
        // Mock data will be used instead, but action buttons won't work
        // this.dataSource = new MatTableDataSource<UserModel>(MOCK_DATA);
      },
      complete: () => {
        this.useFilterPredicate();
      }
    });
  }

  private useFilterPredicate(): void {
    this.dataSource.filterPredicate = (data, filter: string) => {
      const lowerCaseFilter = filter.trim().toLowerCase();
      return data.name.toLowerCase().includes(lowerCaseFilter) ||
             data.paternal_surname.toLowerCase().includes(lowerCaseFilter) ||
             data.maternal_surname.toLowerCase().includes(lowerCaseFilter);
    }
  }

  protected searchUser(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  protected addUser(): void {
    this.router.navigate( ["/create-user"] );
  }

  protected editUser(user: UserModel): void {
    this.router.navigate( [`/edit-user/${user.id}`], { state: {user} } );
  }

  protected deleteUser(user: UserModel): void {
    const userId = user?.id.toString();

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(hasConfirmed => {
      if (hasConfirmed) {
        // Call service to delete user
        this.userServ.deleteUser(userId).subscribe({
          next: (response: any) => {
            this.showAlert(response.message, 'success');
            this.users = this.users.filter(user => user.id != parseInt(userId));
            this.dataSource.data = this.users;
          },
          error: (error: any) => {
            console.error(error);
            this.showAlert(error.message, 'success');
          }
        });
      }
    });

    
  }

  private showAlert(message: string, type: SweetAlertIcon): void {
    Swal.fire({
      text: message,
      icon: type,
      timer: 2000
    });
  }
}
