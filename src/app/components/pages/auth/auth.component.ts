import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

interface LoginForm {
  email: FormControl;
  password: FormControl;
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgOptimizedImage, ReactiveFormsModule],
  providers: [AuthService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  loginForm!: FormGroup<LoginForm>;
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  submitForm() {
    this.authService
      .signIn(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        error: (value) => {

          this.toastr.error('Login ou senha inválidos');
        },
      });
  }
}
