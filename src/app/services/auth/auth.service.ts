import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { AuthResponse } from '../../types/auth-response.type';
import { Router } from '@angular/router';

import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';



interface UserDetails {
  id: number ;
  name: string;
  email: string;
  role: string;

}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isAuth = new BehaviorSubject<boolean>(false);
  apiUrl: string = environment.apiUrl;

  constructor(private router: Router, private httpClient: HttpClient) {
   this.autoSignIn();
  }
  signIn(email: string, password: string): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((value) => {
          localStorage.setItem('auth-token', value.token);
          this.isAuth.next(true);
          this.router.navigate(['home']);


          return value;
        })
      );
  }

  autoSignIn() {
    if (typeof localStorage !== 'undefined') {
      const hasToken = localStorage.getItem('auth-token');
      if (hasToken) {
        this.isAuth.next(true);
        this.router.navigate(['/home']);
      }
    }
  }
  signOut() {
    localStorage.removeItem('auth-token');
    this.isAuth.next(false);
    this.router.navigate(['/auth']);
  }

  getUserDetail = ():UserDetails | null  =>  {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken: any = jwtDecode(token);
    const userDetail = {
      id: decodedToken.userId,
      name: decodedToken.userName,
      email: decodedToken.sub,
      role: decodedToken.role,
    };

    return userDetail;
  };
  private getToken = (): string | null =>{

    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('auth-token') || '';
    }

    return null;
  }

    isLoggedIn = (): boolean => {
      const token = this.getToken();
      if (!token) return false;
      return this.isTokenExpired();
    };

    private isTokenExpired() {
      const token = this.getToken();
      if (!token) return true;
      const decoded = jwtDecode(token);
      const isTokenExpired = Date.now() >= decoded['exp']! * 1000;
      if (isTokenExpired) this.signOut();
      return isTokenExpired;
    }
}

