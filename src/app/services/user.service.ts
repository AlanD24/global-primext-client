import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface UserModel {
  id: number;
  name: string;
  paternal_surname: string;
  maternal_surname: string;
  address: String;
  phone: String;
  actions: String;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.serverUrl;

  constructor(
    private http: HttpClient
  ) { }

  public getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/all`);
  }

  public createUser(userForm: UserModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/create`, userForm);
  }

  public editUser(userForm: UserModel): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/edit`, userForm);
  }

  public deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/delete/${userId}`);
  }
}
