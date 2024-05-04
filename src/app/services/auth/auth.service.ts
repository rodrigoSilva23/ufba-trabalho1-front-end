import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, tap } from 'rxjs';
import { AuthResponse } from '../../types/auth-response.type';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuth = new BehaviorSubject<boolean>(false);

  constructor(private router: Router,private httpClient: HttpClient) {
    this.autoSignIn();
  }
  signIn(email: string, password: string) {
    return this.httpClient.post<AuthResponse>('http://localhost:8080/api/v1/auth/login', { email,password})
      .pipe(
        tap((value) =>{
          localStorage.setItem('auth-token', value.token);
          this.isAuth.next(true);
          this.router.navigate(['/home']);
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
}
