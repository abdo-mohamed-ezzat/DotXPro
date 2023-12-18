import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '@app/viewModels/iuser';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private userSubject!: BehaviorSubject<IUser | null>;
  public user!: Observable<IUser | null>;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<IUser | null>(
      JSON.parse(localStorage.getItem('user')!)
    );
    this.user = this.userSubject.asObservable();
  }

  get userValue(): IUser | null {
    return this.userSubject.value;
  }

  //debug this method to see the data sent to the server
  
  login(userName: string, password: string, branchID: number, theYear: number) {
    console .log("username: " + userName + " password: " + password + " branchID: " + branchID + " date: " + theYear);
    return this.http
      .post<any>(`${environment.APIURL}/Administration/Auth/Login`, {
        userName,
        password,
        branchID,
        theYear
      })
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        })
      );
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
